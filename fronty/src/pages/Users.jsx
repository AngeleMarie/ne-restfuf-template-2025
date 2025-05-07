import React,{useState,useEffect} from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import { useNavigate,useLocation } from 'react-router-dom'
import { axiosPrivate } from '../api/axios'


function Users() {
    const [users,setUsers]=useState()
    const refresh=useRefreshToken()
    const navigate=useNavigate()
    const location=useLocation()

    useEffect(()=>{
        let isMounted=true;
        const controller=new AbortController();
        const getUsers=async()=>{
            try {
                const response=await axiosPrivate.get('/users',{
                    signal:controller.signal
                })
                const emails=response.data.map(user=>user.email)
                console.log(response.data);
                isMounted && setUsers(emails)                
            } catch (error) {
                console.error(error);
                navigate('/login',{state:{from:location}, replace:true})
                
            }
        }
        getUsers();

        return ()=>{
            isMounted=false
            controller.abort();
        }
    },[])
  return (
    <article>
        <h2>Users</h2>
        {users?.length
        ?(
            <ul>
                {users.map((user,i)=>
                <li key={i}>{user }</li>)}
            </ul>
        ):
        <p>No users to display</p>

        }
        <button onClick={()=>refresh()}>Refresh</button>
        <br />
    </article>
  )
}

export default Users