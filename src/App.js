import { useState,useEffect } from "react";
import $ from 'jquery';


function App() {
  const [localData,setLocalData] = useState([]);
  
  useEffect(() => {
    fetch('https://notes-adgu.onrender.com')
    .then(responce=>responce.json())
    .then(data=>{
      console.log(data.data)
      setLocalData(data.data.rows);
    })
    .catch(error=>{
    })
  }, []);

  // Api call to delete element
  const deleteElement = (key)=>{
    fetch('https://notes-adgu.onrender.com/deleteNote',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({title:key})
    })
    .then(responce=>responce.json())
    .then(data=>{
      setLocalData(data.data.rows);
    })
    .catch(error=>{
    })
  }

  // Api call to add element
  $('#dataForm').submit((event)=>{
    event.preventDefault();
    if($('#title').val() === "" || $('#data').val() === ""){
      console.log("empty")
    }
    else{
      let value = {
        title:$('#title').val(),
        data:$('#data').val()
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
        setLocalData(data.data.rows);
        $('#title').val("");
        $('#data').val("");
      })
      .catch(error=>{
      })
    }
    return false;
  })

  // Format dateTime
  const formatDateTime = (element)=>{
    let date = element.split('T')
    return date[0]+" "+date[1].split('.')[0]
  }
  
  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div class="container">
          <a class="navbar-brand mx-auto fw-bold" href="/">Notes</a>
        </div>
      </nav>
      <section className="form-section">
        <div className="container">
          <form action="POST" className="w-75 mx-auto my-5" id="dataForm">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" placeholder="Title" />
            </div>
            <div className="mb-3">
              <label htmlFor="data" className="form-label">Data</label>
              <input type="text" className="form-control" id="data" placeholder="Note" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </section>
      <section className="Notes">
        <div className="container">
          {localData.length ? localData.map((element,index)=>{
              return <div key={index} className="card">
                  <div className="card-title py-2 px-4">{element.title}</div>
                  <div className="card-body px-4">{element.data}</div>
                  <div className="card-footer">{formatDateTime(element.datetime)} <button className="btn btn-danger rounded-circle p-2" onClick={()=>{deleteElement(element.title)}}>
                    <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z"/><path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </button>
                  </div>
                </div>
            }):<p className="text-center">No data found</p>}
        </div>
      </section>
    </>
  );
}

export default App;
