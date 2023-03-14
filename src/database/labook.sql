-- Active: 1678712747838@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

INSERT INTO
    users(
        id,
        name,
        email,
        password,
        role,
        created_at
    )
VALUES (
        "u001",
        "Duncan Jason",
        "duncanj@gmail.com",
        "123456",
        "Admin",
        DATETIME('now')
    ), (
        "u002",
        "Julio Matias",
        "matias@gmail.com",
        "123456",
        "User",
        DATETIME('now')
    ), (
        "u003",
        "Celeste Carolina",
        "celeste@email.com",
        "123456",
        "User",
        DATETIME('now')
    ), (
        "u004",
        "Valentina Pascal",
        "val@email.com",
        "123456",
        "User",
        DATETIME('now')
    );

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id)
    );

DROP TABLE posts;

INSERT INTO
    posts(
        id,
        creator_id,
        content,
        likes,
        dislikes,
        created_at,
        updated_at
    )
VALUES (
        "p001",
        "u001",
        "Hoje vou estudar POO!",
        13,
        1,
        DATETIME('now'),
        DATETIME('now')
    ), (
        "p002",
        "u002",
        "kkkkkkkkkrying",
        14,
        2,
        DATETIME('now'),
        DATETIME('now')
    ), (
        "p003",
        "u003",
        "Partiu happy hour!",
        23,
        1,
        DATETIME('now'),
        DATETIME('now')
    ), (
        "p004",
        "u004",
        "Partiu happy hour lá no point de sempre!",
        44,
        2,
        DATETIME('now'),
        DATETIME('now')
    );

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) FOREIGN KEY (post_id) REFERENCES posts(id)
    );

INSERT INTO
    likes_dislikes(user_id, post_id, like)
VALUES ("u001", "p004", 1), ("u002", "p003", 2), ("u004", "p001", 3);

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes;

SELECT
    posts.id,
    posts.creator_id,
    posts.content,
    posts.likes,
    posts.dislikes ,
    posts.created_at,
    posts.updated_at,
    users.name AS creator_name
FROM posts
JOIN users
on posts.creator_id = users.id