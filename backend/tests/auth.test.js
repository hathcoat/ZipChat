const request = require("supertest"); //Support HTTP reqs
const { app } = require("../server");
const { connectDB, closeDB } = require("../db");
const { MongoMemoryServer } = require("mongodb-memory-server"); //In mem database for testing.
const User = require("../User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

let mongoServer; //Store in memory MongoDB instance.
let server;

jest.setTimeout(10000); //Set test timeout

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create(); //Start in memory server.
    await connectDB(mongoServer.getUri())
    process.env.JWT_SECRET = "testsecret";
    server = app.listen(0, () => console.log(`Test server running on Port ${server.address().port}`));

});

afterAll(async () => {
    await closeDB();
    await mongoServer.stop();

    if(server && server.listening){
        await new Promise((resolve) => server.close(resolve));
    }
});

describe("Authentication routes", () => {
    //Store test user and valid token
    let testUser;
    let token;

    beforeEach(async() => {
        await mongoose.connection.dropDatabase();
        await User.deleteMany({}); //Clear database.

        const hashedPassword = await bcrypt.hash("password", 10);
        testUser = await User.create({
            username: "testuser",
            password: hashedPassword,
            first_name: "Rob",
            last_name: "Bob",
        });

        token = jwt.sign({ id: testUser._id.toString() }, process.env.JWT_SECRET);
    });

    test("should register a user successfully", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "newuser",
            password: "securepassword",
        });

        expect(res.statusCode).toBe(201); //Expect 201 created status code.
        expect(res.body).toHaveProperty("message"); //Expect a response message.
    });

    test("should return 500 if a database error occurs during registration", async () => {
        jest.spyOn(User.prototype, "save").mockRejectedValueOnce(new Error("Database error"));

        const res = await request(app).post("/api/auth/register").send({
            username: "testerror",
            password: "securepassword",
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Server error");

        User.prototype.save.mockRestore(); //Restore original function
    });

    test("should fail if username is taken", async() => {
        const res = await request(app).post("/api/auth/register").send({
            username: "testuser", //Username already taken
            password: "securepassword",
        });

        expect(res.statusCode).toBe(400); //Expect 400 Bad Request
        expect(res.body.message).toBe("User already taken.");
    });

    //When Redirect is false
    test("should login successfully and return a token", async () => {
        const res = await request(app).post("/api/auth/login").send({
            username: "testuser", 
            password: "password",
        });

        expect(res.statusCode).toBe(200); //Success status
        expect(res.body).toHaveProperty("token"); //Should have a token.
        expect(res.body.redirect).toBe(false); //Should be false since first and last names are set.
    });

    test("should login and redirect if no first or last name", async () => {
        const userWithouName = await User.create({
            username: "no-name-user",
            password: await bcrypt.hash("password123", 10),
        });

        const res = await request(app).post("/api/auth/login").send({
            username: "no-name-user",
            password: "password123",
        });

        expect(res.statusCode).toBe(200); //Success status
        expect(res.body).toHaveProperty("token"); //Should have a token.
        expect(res.body.redirect).toBe(true); //Should be false since first and last names are set.
    });

    test("should fail to log in with wrong password", async () => {
        const res = await request(app).post("/api/auth/login").send({
            username: "testuser", 
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(400); //400 Bad request
        expect(res.body.message).toBe("Invalid credentials");
    });

    test("should update users name", async() => {
        const res = await request(app)
        .post("/api/auth/setname")
        .set("Authorization", `Bearer ${token}`)
        .send({
            first_name: "New",
            last_name: "Name",
            avatarColor: "#ff0000"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Name updated successfully.");
    });

    test("should return 500 if an error occures when updating name", async () => {
        jest.spyOn(User.prototype, "save").mockRejectedValueOnce(new Error("Database Error"));

        const res = await request(app)
            .post("/api/auth/setname")
            .set("Authorization", `Bearer ${token}`)
            .send({
                first_name: "New",
                last_name: "Name",
                avatarColor: "#ff0000",
            });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Server error.");
        expect(res.body.redirect).toBe(false);

        User.prototype.save.mockRestore(); // Restore original function   
    });

    test("should deny name update without token", async () => {
        const res = await request(app).post("/api/auth/setname").send({
            first_name: "New",
            last_name: "Name",
            avatarColor: "#ff0000"
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("No token, authorization denied");
    });

    //Test: Get /api/auth/:username
    test("should fetch user by username", async () => {
        const res = await request(app).get(`/api/auth/user/${testUser.username}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("first_name", "Rob");
    });

    //Test: Get /api/auth/:username (user not found)
    test("should return 404 if user is not found when fetching", async () => {
        const res = await request(app).get("/api/auth/user/nonexistentuser");

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    test("should update avatar color", async() => {
        const res = await request(app).put("/api/auth/avatar").send({
            userId: testUser._id,
            avatarColor: "#00ff00",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.avatarColor).toBe("#00ff00");
    });

    test("should return 404 if trying to update avatar for non-existent user", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app).put("/api/auth/avatar").send({
            userId: nonExistentId.toString(),
            avatarColor: "ff0000",
        });

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe("User not found");
    });

    //Test: GET /api/auth/user/:usrname
    test("should fetch user details by username", async () => {
        const res = await request(app).get(`/api/auth/user/${testUser.username}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("first_name", "Rob");
        expect(res.body).toHaveProperty("last_name", "Bob");
        expect(res.body).toHaveProperty("avatarColor");
    });

    //Test: GET /api/auth/user/:username (User not found)
    test("should return 404 if user is not found (fetch user details)", async () => {
        const res = await request(app).get("/api/auth/user/nonexistentuser");

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    //Test Get /api/auth/
    test("should return success message from base auth route", async () => {
        const res = await request(app).get("/api/auth/");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Auth route working");
    });

    //Test post /api/auth/
    test("should confirm JSON recieve in POST request", async () => {
        const res = await request(app).post("/api/auth/").send({
            exampleData: "testValue"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Recieved JSON successfully!");
    });
});