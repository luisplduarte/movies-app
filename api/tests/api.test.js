const Mongoose = require("mongoose").Mongoose;
const request = require("supertest");
const app = require("../app");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const MovieLogs = require('../models/movieLogsModel');

jest.mock('../models/movieLogsModel');

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

/**
 * Tests for user reviews endpoint that has pagination
 */
describe("GET /movie-logs/paginated", () => {

    beforeEach(() => {
        MovieLogs.paginate.mockReset(); 
    });

    it("Should return empty movie logs for the user", async () => {
        MovieLogs.paginate.mockResolvedValue({
            docs: [],
            totalDocs: 0,
            limit: 5,
            page: 1,
            totalPages: 1
        });

        const res = await request(app)
            .get("/movie-logs/paginated")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.movieLogs).toStrictEqual([]);
        expect(res.body.totalItems).toBe(0);
        expect(res.body.totalPages).toBe(1);
        expect(res.body.currentPage).toBe(0);
    });
 
    it("Should return 1st page with 5 movie logs for the user", async () => {
        MovieLogs.paginate.mockResolvedValue({
            docs: [
                { movieId: "1", rating: 3.5 },
                { movieId: "2", rating: 4 },
                { movieId: "3", rating: 5 },
                { movieId: "4", rating: 3 },
                { movieId: "5", rating: 2 },
            ],
            totalDocs: 12,
            limit: 5,
            page: 1,
            totalPages: 3,
        });

        const res = await request(app)
            .get("/movie-logs/paginated?page=1&size=5")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.movieLogs.length).toBe(5);

        expect(res.body.movieLogs[0].movieId).toBe("1");
        expect(res.body.movieLogs[0].rating).toBe(3.5);

        expect(res.body.movieLogs[4].movieId).toBe("5");
        expect(res.body.movieLogs[4].rating).toBe(2);
    });

    it("Should return 2nd page with 5 movie logs for the user", async () => {
        MovieLogs.paginate.mockResolvedValue({
            docs: [
                { movieId: "6", rating: 5 },
                { movieId: "7", rating: 4.5 },
                { movieId: "8", rating: 3 },
                { movieId: "9", rating: 2 },
                { movieId: "10", rating: 4 },
            ],
            totalDocs: 12,
            limit: 5,
            page: 2,
            totalPages: 3,
        });

        const res = await request(app)
            .get("/movie-logs/paginated?page=2&size=5")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.movieLogs.length).toBe(5);

        expect(res.body.movieLogs[0].movieId).toBe("6");
        expect(res.body.movieLogs[0].rating).toBe(5);

        expect(res.body.movieLogs[4].movieId).toBe("10");
        expect(res.body.movieLogs[4].rating).toBe(4);
    });

    it("Should return 3rd page with only 2 movie logs for the user", async () => {
        MovieLogs.paginate.mockResolvedValue({
            docs: [
                { movieId: "11", rating: 4 },
                { movieId: "12", rating: 4 },
            ],
            totalDocs: 12,
            limit: 5,
            page: 3,
            totalPages: 3,
        });

        const res = await request(app)
            .get("/movie-logs/paginated?page=3&size=5")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.movieLogs.length).toBe(2);

        expect(res.body.movieLogs[0].movieId).toBe("11");
        expect(res.body.movieLogs[0].rating).toBe(4);

        expect(res.body.movieLogs[1].movieId).toBe("12");
        expect(res.body.movieLogs[1].rating).toBe(4);
    });

    it("Should give 400 status code because requested page doesn't exist", async () => {
        MovieLogs.paginate.mockResolvedValue({
            docs: [],
            totalDocs: 12,
            limit: 5,
            page: 4,
            totalPages: 3,
        });

        const res = await request(app)
            .get("/movie-logs/paginated?page=4&size=5")
            .set("Authorization", `Bearer ${global.token}`);

        expect(res.statusCode).toBe(200);
    });
});