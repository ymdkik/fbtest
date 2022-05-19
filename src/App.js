import React, { useEffect, useState } from "react";
import './App.css';
import { db } from './Firebase';
import { doc, addDoc, deleteDoc, onSnapshot, collection, query } from "firebase/firestore";

async function CreateUser(first, second, age) {
    await addDoc(collection(db, "users"), {
        first: first,
        second: second,
        age: age
    })
}

function CreateUserForm() {
    const [first, setFirst] = useState("first")
    const [second, setSecond] = useState("second")
    const [age, setAge] = useState("age")
    return (
        <>
            <p>user form</p>
            <input type="first" size="10" value={first} onChange={(e) => setFirst(e.target.value)} />
            <input type="second" size="10" value={second} onChange={(e) => setSecond(e.target.value)} />
            <input type="age" size="10" value={age} onChange={(e) => setAge(e.target.value)} />
            <button onClick={() => CreateUser(first, second, age)}>new</button>
        </>
    );
}

async function DeleteUser(id) {
    if(id) await deleteDoc(doc(db, "users", String(id)));
}

function RenderUsers(props) {
    console.log(props)
    if(props.data.length){
        return (
            <>
                {props.data.map((d, i) =>
                    <tr>
                        <td>{d.value.first}</td>
                        <td>{d.value.second}</td>
                        <td>{d.value.age}</td>
                        <td><button onClick={() => DeleteUser(d.key)}>delete</button></td>
                    </tr>
                )}
            </>
        )
    }
}

function UserView() {
    const [data, setData] = useState([])

    useEffect(() => {onSnapshot(query(collection(db, "users")), (querySnapshot) => {
        const k = []
        querySnapshot.forEach((doc) => {
            k.push({
                key: doc.id,
                value: doc.data()
            })
        })
        setData(k)
    })}, [])

    return (
        <>
            <p>itiran</p>
            <table border="1" width="500">
                <tr>
                    <th>First</th>
                    <th>Second</th>
                    <th>Age</th>
                </tr>
                <RenderUsers data={data}/>
            </table>
        </>
    )
}

function App() {
    return (
        <div>
            <CreateUserForm />
            <UserView />
        </div>
    )
}

export default App