import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminFinesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [fines, setFines] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [form, setForm] = useState({
    rental_id: "",
    amount: "",
    reason: "",
  });

  const fetchFines = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/fines`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setFines(res.data);

    } catch(err){
      console.error(err);
    }
  };

  const fetchRentals = async () => {
    try{

      const res = await axios.get(
        `${API_URL}/api/rentals`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setRentals(
        res.data.filter(
          r =>
          r.status==="active" ||
          r.status==="returned"
        )
      );

    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchFines();
    fetchRentals();
  },[]);

  const handleChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const createFine=async(e)=>{
    e.preventDefault();

    try{

      await axios.post(
        `${API_URL}/api/fines`,
        {
          rental_id:Number(form.rental_id),
          amount:Number(form.amount),
          reason:form.reason
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setForm({
        rental_id:"",
        amount:"",
        reason:""
      });

      fetchFines();

    }catch(err){
      alert(
        err.response?.data?.message ||
        "Gagal tambah denda"
      );
    }
  };

  const togglePaid=async(fine)=>{

    try{

      await axios.put(
        `${API_URL}/api/fines/${fine.id}/status`,
        {
          status:
          fine.status==="paid"
          ?"unpaid"
          :"paid"
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      fetchFines();

    }catch(err){
      console.error(err);
    }

  };

  const deleteFine=async(id)=>{

    if(
      !window.confirm(
        "Hapus denda?"
      )
    ) return;

    await axios.delete(
      `${API_URL}/api/fines/${id}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    fetchFines();

  };

  return(

<div className="min-h-screen bg-gray-50">

<nav className="bg-white shadow p-4">

<div className="max-w-6xl mx-auto flex justify-between">

<button
onClick={()=>
navigate("/dashboard")
}
className="flex gap-2"
>

<ArrowLeft/>
Kembali

</button>

<h1 className="flex gap-2 font-bold text-2xl">

<AlertTriangle
className="text-yellow-500"
/>

Kelola Denda

</h1>

</div>

</nav>

<div
className="
max-w-6xl
mx-auto
p-6
grid
lg:grid-cols-3
gap-6
"
>

<form
onSubmit={createFine}
className="
bg-white
shadow
rounded-xl
p-5
"
>

<h2
className="
font-bold
mb-4
"
>

Tambah Denda

</h2>

<select
name="rental_id"
value={form.rental_id}
onChange={handleChange}
required
className="
w-full
border
p-3
rounded
mb-3
"
>

<option value="">
Pilih Rental
</option>

{
rentals.map(
r=>(

<option
key={r.id}
value={r.id}
>

Rental #{r.id}

</option>

)
)
}

</select>

<input
name="amount"
type="number"
placeholder="Nominal"
value={form.amount}
onChange={handleChange}
required
className="
w-full
border
p-3
rounded
mb-3
"
/>

<input
name="reason"
placeholder="Alasan"
value={form.reason}
onChange={handleChange}
required
className="
w-full
border
p-3
rounded
mb-4
"
/>

<button
className="
w-full
bg-yellow-500
text-white
p-3
rounded
"
>

Tambah

</button>

</form>

<div
className="
lg:col-span-2
space-y-4
"
>

{
fines.map(
fine=>(

<div
key={fine.id}
className="
bg-white
shadow
rounded-xl
p-5
"
>

<h3
className="
font-bold
"
>

Rental #
{fine.rental_id}

</h3>

<p>
Rp
{
Number(
fine.amount
)
.toLocaleString()
}
</p>

<p>
{fine.reason}
</p>

<p
className={
fine.status==="paid"
?"text-green-600"
:"text-red-600"
}
>

{fine.status}

</p>

<div
className="
flex
gap-2
mt-3
"
>

<button

onClick={()=>
togglePaid(
fine
)
}

className="
bg-blue-600
text-white
px-3
py-2
rounded
"

>

Toggle Status

</button>

<button

onClick={()=>
deleteFine(
fine.id
)
}

className="
bg-red-600
text-white
px-3
py-2
rounded
"

>

Hapus

</button>

</div>

</div>

)
)
}

</div>

</div>

</div>

);

}

export default AdminFinesPage;