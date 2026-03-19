const express = require("express")
const db = require("./db")
const jwt = require("jsonwebtoken")
const bcr = require('bcryptjs')

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res
        .status(200)
        .json({ message: "Hello world" })
})

app.get("/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all()
    return res.status(200).json(users)
})

app.post("/users", (req, res) => {
    const { email, name, password } = req.body
    try {
        if (!email || !name || !password)
            return res
                .status(400)
                .json({ error: "Не хватает данных" })
        const query = db
            .prepare(`INSERT INTO users (name, email, password) VALUES (?, ?)`).run(name, email, password)
        const newUser = db
            .prepare("SELECT * FROM users WHERE id = ?").get(query.lastInsertRowid)
        res.status(200).json(newUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Что-то пошло не так" })
    }
})

app.listen(3000)

app.delete("/users", (req, res) => {
    const { id } = req.body
    try {
        if (!id) {
            return res
                .status(400)
                .json({ error: "Не хватает данных" })
        }
        const query = db
            .prepare(`DELETE FROM users WHERE id=?`).run(id)
        res.status(200).json(query.changes)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Что-то пошло не так" })
    }
})

app.put("/users",(req, res) => { 
    const {email, name, password} = req.body
   
})
