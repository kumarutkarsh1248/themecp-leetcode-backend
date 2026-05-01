const { getDB } = require("../config/db");

async function addUser(req, res) {
    const db = getDB();
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "name and email are required"
        });
    }

    try {
        await db.beginTransaction();

        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        let userId;

        if (existingUsers.length > 0) {
            userId = existingUsers[0].id;
        } else {
            const [userResult] = await db.query(
                "INSERT INTO users (username, email) VALUES (?, ?)",
                [name, email]
            );
            userId = userResult.insertId;
        }

        const [existingProfile] = await db.query(
            "SELECT id FROM theme_profile WHERE user_id = ?",
            [userId]
        );

        if (existingProfile.length === 0) {
            await db.query(
                "INSERT INTO theme_profile (user_id, email) VALUES (?, ?)",
                [userId, email]
            );
        }

        await db.commit();

        return res.status(200).json({
            message: "User ready",
            user_id: userId
        });
    } catch (err) {
        await db.rollback();
        console.error("Error in /add_user:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function getProfileName(req, res) {
    const email = req.query.email;
    const db = getDB();

    if (!email) {
        return res.status(400).json({
            message: "Email is required",
        });
    }

    try {
        const sql = `
            SELECT leetcode_profile_name
            FROM users
            WHERE email = ?
        `;

        const [result] = await db.query(sql, [email]);

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json({
            leetcode_profile_name: result[0].leetcode_profile_name
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function saveProfileName(req, res) {
    const { email, user_profile_name } = req.body;
    const db = getDB();

    if (!email || !user_profile_name) {
        return res.status(400).json({
            message: "Email and profile name are required",
        });
    }
    console.log(email)

    try {
        const sql = `
            UPDATE users
            SET leetcode_profile_name = ?
            WHERE email = ?
        `;

        const [result] = await db.query(sql, [
            user_profile_name,
            email
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User profile name updated successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// app.delete("/remove_user/:name", async (req, res) => {

//     const sub = req.params.sub;
//     const sql = "DELETE FROM users WHERE name = ?";

//     try {
//         const [rows, field] = await db.query(sql, [
//             name
//         ]);
//         console.log("++++++++++++++++++++++++++++++++")
//         console.log("rows", rows)
//         console.log("fields ", field)
//     } catch (err) {
//         if (err.code === "ER_DUP_ENTRY") {
//             console.log("Duplicate:", el.ID);
//         } else {
//             console.error("Error:", err);
//         }
//     }
// });

module.exports = { addUser, getProfileName, saveProfileName };