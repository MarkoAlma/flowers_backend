import express, { response } from "express"
import mysql from "mysql2"
import cors from "cors"
import { configDB } from "./configDB.js"

const db = mysql.createConnection(configDB)
const app = express()

app.use(cors())
app.use(express.json())

const port = 8000

app.get("/api/search/:nev", (req, resp)=>{
    const sql = "SELECT kategoriak.nev as kategNev, aruk.nev, leiras, keszlet, ar, kepUrl FROM aruk, kategoriak WHERE aruk.kategoriaId = kategoriak.id and INSTR(aruk.nev, ?)"
    const {nev} = req.params
    const values = [nev]
    db.query(sql, values, (error, result)=>{
        if (error) {
            console.log(error);
            resp.status(500).json({error:"Adatbázis hiba !!!"})
        }else if (result.length < 1) {
            resp.status(404).json({error:"Nincs találat!"})
        }
        else {
            resp.status(200).send(result)
        }
    })
})

app.get("/api/flowers/:id", (req, resp)=>{
    const sql = "SELECT kategoriak.nev as kategNev, aruk.nev, leiras, keszlet, ar, kepUrl FROM aruk, kategoriak WHERE aruk.kategoriaId = kategoriak.id and aruk.id = ?;"
    const {id} = req.params
    const values = [id]
    db.query(sql, values, (error, result)=>{
        if (error) {
            console.log(error);
            resp.status(500).json({error:"Adatbázis hiba !!!"})
        }else if (result.length < 1) {
            resp.status(404).json({error:"Nincs találat!"})
        }
        else {
            resp.status(200).send(result)
        }
    })
})

app.get("/api/flowersbycateg/:id", (req, resp)=>{
    const sql = "SELECT aruk.id, kategoriak.nev as kategNev, aruk.nev, leiras, keszlet, ar, kepUrl FROM aruk, kategoriak WHERE aruk.kategoriaId = kategoriak.id and aruk.kategoriaId = ?;"
    const {id} = req.params
    const values = [id]
    db.query(sql, values, (error, result)=>{
        if (error) {
            console.log(error);
            resp.status(500).json({error:"Adatbázis hiba !!!"})
        }else if (result.length < 1) {
            resp.status(404).json({error:"Nincs találat!"})
        }
        else {
            resp.status(200).send(result)
        }
    })
})

app.get("/api/categories", (req, resp)=>{
    const sql = "SELECT * FROM kategoriak;"
    const {id} = req.params
    const values = [id]
    db.query(sql, values, (error, result)=>{
        if (error) {
            console.log(error);
            resp.status(500).json({error:"Adatbázis hiba !!!"})
        }else if (result.length < 1) {
            resp.status(404).json({error:"Nincs találat!"})
        }
        else {
            resp.status(200).send(result)
        }
    })
})

app.post("/api/flowers/:id", (req, resp)=>{
    const {keszlet} = req.body
    const {id} = req.params
    if (!keszlet) {
        return resp.status(400).json({error:"Nincs megadva az összes attribútum"})
    }
    const sql = "UPDATE aruk SET keszlet = ? WHERE aruk.id = ?;"
    const values = [keszlet, id]
    db.query(sql, values, (error, result)=>{
        if (error) {
            console.log(error);
            resp.status(500).json({error:"Adatbázis hiba !!!"})
        }else {
            resp.status(201).send({result})
        }
    })
})

app.delete("/api/flowers/:id", (req, resp)=>{
    const {id} = req.params
    const sql = "DELETE FROM aruk WHERE aruk.id=?"
    const values = [id]
    db.query(sql, values, (error, result)=>{
        if (error) {
            resp.status(500).json({error:"error!"})
        }else if (result.affectedRows == 0) {
            resp.status(404).json({msg:"A virág nem található!"})
        }
        else {
            resp.status(200).json({msg:"Sikeres törlés!"})
        }
    })
})

app.listen(port,()=>console.log(`A szerver hallgatózik a ${port} porton`))
