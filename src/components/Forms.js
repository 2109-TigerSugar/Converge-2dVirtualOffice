import React, { useState } from "react";


// export const CreateForm = () => {
//   const [roomKey, setRoomKey] = useState('')

//   const handleChange = (event) => {
//     setRoomKey(event.target.value)
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault()
//     console.log(roomKey)
//   }

//   return (
//     <form onSubmit= {handleSubmit}>
//       <label>Name</label>

//       <label htmlFor="officeKey">Enter Room Key</label>
//       <input type="text" name="officeKey" id= "officeKey" value={ roomKey } onChange= {handleChange}/>
//       <button type="submit">create</button>
//     </form>
//   )
// }


export const JoinOrCreateForm = (props) => {
  const [userData, setUserData] = useState({
    name:"",
    roomKey: "",
    officeType: "",
  })

if(props.formType === 'create') {

}

  const handleChange = (event) => {
    setUserData({...userData, [event.target.name]: event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(userData)
  }


  return(
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" value={userData.name} onChange= {handleChange}/>
      <label htmlFor="officeKey">Room Key</label>
      <input type="text" name="roomKey" id="officeKey" value={userData.roomKey} onChange= {handleChange}/>
      <label htmlFor="officeType">Office Type</label>
      <input type="text" name="officeType" id="officeType" value={userData.officeType} onChange= {handleChange}/>
      <button type="submit">{props.formType}</button>
    </form>
  )
}
