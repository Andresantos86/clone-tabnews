const Http = require('http')

test("GET TO /api/v1/status should return 200", async ()=>{
  //const response = await fetch("http://localhost:3000/api/vi/status")
  Http.get("http://localhost:3000/api/v1/status",res => {
    expect(res.status).toBe(200)
    });
  
})