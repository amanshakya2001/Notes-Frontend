import { useState,useEffect } from "react";
import $ from 'jquery';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider,signOut } from "firebase/auth";
import Swal from 'sweetalert2';

const provider = new GoogleAuthProvider();

function App() {
  const [localData,setLocalData] = useState([]);
  const [isLogin,setIsLogin] = useState(false);
  const [user,setUser] = useState("");
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true);
        setUser(user.email);
        fetch('https://notes-adgu.onrender.com')
        .then(responce=>responce.json())
        .then(data=>{
          $(".spinner-border").hide();
          $("button").removeAttr("disabled");
          let userdata = data.data.rows.filter((element)=>{
            return element.username ==  user.email;
          })
          localDataHandler(userdata);
          console.log("use effect");
        })
        .catch(error=>{
        })
      } 
      else{
        $(".spinner-border").hide();
        $("button").removeAttr("disabled");
      }
    });

    return unsubscribe;
  }, []);

  // google login
  const googleLogin = ()=>{
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setIsLogin(true);
        setUser(user.email);
        console.log("google login");
      }).catch((error) => {
      });
  }

  const logout = ()=>{
    signOut(auth).then(() => {
      setIsLogin(false);
      setLocalData({});
      console.log("logout");
      Swal.fire({
        title: 'Success!',
        text: 'Logout Sucessfully',
        icon: 'success',
        timer: 1000,
      });
    }).catch((error) => {
    });
  }


  // Api call to delete element
  const deleteElement = (key)=>{
    $(".spinner-border").show();
    fetch('https://notes-adgu.onrender.com/deleteNote',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({title:key})
    })
    .then(responce=>responce.json())
    .then(data=>{
      let userdata = data.data.rows.filter((element)=>{
        return element.username == user;
      })
      localDataHandler(userdata);
      $(".spinner-border").hide();
      console.log("delete");
      Swal.fire({
        title: 'Success!',
        text: 'Your Notes Deleted Sucessfully',
        icon: 'success',
        timer: 1000,
      });
    })
    .catch(error=>{
    })
  }

  // Api call to add element
  const addData = (event)=>{
    event.preventDefault();
    console.log("submit form");
    $(".spinner-border").show();
    if($('#title').val() === "" || $('#data').val() === "" ){
      $(".spinner-border").hide();
      Swal.fire({
        title: 'Error!',
        text: 'Value should not be Empty',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    else{
      if(!isLogin){
        $(".spinner-border").hide();
        Swal.fire({
          title: 'Error!',
          text: 'Login required',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      let value = {
        title:$('#title').val(),
        data:$('#data').val(),
        username:user
      }
      fetch('https://notes-adgu.onrender.com/createNote',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(value)
      })
      .then(responce=>responce.json())
      .then(data=>{
        let userdata = data.data.rows.filter((element)=>{
          return element.username == user;
        })
        localDataHandler(userdata);
        $('#title').val("");
        $('#data').val("");
        $(".spinner-border").hide();
        $('.btn-close').click();
        Swal.fire({
          title: 'Success!',
          text: 'Notes Added Sucessfully',
          icon: 'success',
          timer: 1000,
          confirmButtonText: 'OK'
        });
      })
      .catch(error=>{
        console.log(error)
      })
    }
  }


  // Set Local data
  const localDataHandler =(data)=>{
    setLocalData(data);
  }
  // Format dateTime
  const formatDateTime = (element)=>{
    let date = element.split('T')
    return date[0]+" "+date[1].split('.')[0]
  }
  
  return (
    <>
      <div className="mobile-block">
        <p>This Site Only Support in Desktop.</p>
      </div>
      <div className="spinner-border position-absolute top-50 start-50" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 shadow fixed-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            <img className="me-3" src="./images/Ellipse 1.png" alt="logo" />
            Notes
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {!isLogin ?
              <button className="nav-link active btn btn-primary text-white px-5 fw-bold rounded-pill py-2" aria-current="page" onClick={googleLogin}>Login</button>:
              <ul className="navbar-nav">
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-white fw-bold rounded-circle avtar" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user[0].toUpperCase()}
                </a>
                <ul class="dropdown-menu shadow">
                  <li><a class="dropdown-item" href="#" onClick={logout}>Logout</a></li>
                </ul>
              </li>
              </ul>
              }
              
            </li>
          </ul>
        </div>

        </div>
      </nav>
      <section className="Notes mt-5 pt-5">
        <div className="container mt-5">
          {isLogin?<div className="card border-0 h-100 pointer" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <div className="card-body p-4 d-flex align-items-center">
              <img src="./images/plus.png" alt="plus icon" className="mx-auto d-table" width={50} />
            </div>
          </div>:""}
          {localData.length ? localData.map((element,index)=>{
              return <div key={index} className="card border-0 hover">
                  <div className="card-title py-2 px-4">{element.title}</div>
                  <div className="card-body px-4">{element.data}</div>
                  <div className="card-footer">{formatDateTime(element.datetime)} <button className="btn btn-danger rounded-circle p-2" onClick={()=>{deleteElement(element.title)}}>
                    <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z"/><path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </button>
                  </div>
                </div>
            }):isLogin?<p className="text-center mt-5">No data found</p>:<p className="text-center mt-5 fs-1">Login to View your Notes</p>}
        </div>
      </section>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Notes</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <form className="my-3" id="dataForm" onSubmit={addData}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="title" placeholder="Title" />
              </div>
              <div className="mb-3">
                <label htmlFor="data" className="form-label">Data</label>
                <input type="text" className="form-control" id="data" placeholder="Note" />
              </div>
              <button type="submit" className="btn btn-primary float-end mt-4 px-5" disabled>Submit</button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
