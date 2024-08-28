const Mongoose = require("mongoose").Mongoose;
const request = require("supertest");
const app = require("../app");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

require("dotenv").config();

const DB_INSTANCE = new Mongoose();

beforeAll(async () => {
    await DB_INSTANCE.connect(process.env.MONGO_TESTS_URI);
});

beforeEach(async () => {
    // Test user
    global.user = new User({
        username: "testuser",
        password: "password123",
        bio: "This is a bio"
    });
    await global.user.save();

    // Generate JWT token for test user
    global.token = jwt.sign({ id: global.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterEach(async () => {
    await User.deleteMany({ _id: global.user._id });
});

afterAll(async () => {
    await DB_INSTANCE.disconnect();
});


/**
 * Test if get profile returns correct user info from DB
 */
describe("GET /profile", () => {
    it("Should return user profile", async () => {
        const res = await request(app)
            .get("/profile")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe(global.user.username);
        expect(res.body.bio).toBe(global.user.bio);
    });
});

/**
 * Test for favorites playlist
 */
describe("GET /playlists/favorites", () => {
    it("Should return empty favorites playlist for the user", async () => {
        const res = await request(app)
            .get("/playlists/favorites")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.movies).toStrictEqual([]);
    });

    it("Should return populated favorites playlist for the user", async () => {
        // Create a new user log for the movie
        await request(app)
            .post("/movie-logs")
            .send({ movieId: '1129598', favorite: true })
            .set("Authorization", `Bearer ${global.token}`);

        const res = await request(app)
            .get("/playlists/favorites")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.movies).toEqual(['1129598']);
    });

    it("Should give 401 status code because request is without authentication", async () => {
        const res = await request(app)
            .get("/playlists/favorites");

        expect(res.statusCode).toBe(401);
    });
});