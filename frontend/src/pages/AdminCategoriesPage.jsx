import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function AdminCategoriesPage() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [categories,setCategories]=useState([]);
  const [editingId,setEditingId]=useState(null);

  const [form,setForm]=useState({
    name:"",
    description:""
  });

  const fetchCategories=async()=>{

    try{

      const res=await axios.get(
        `${API_URL}/api/categories`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setCategories(res.data);

    }catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchCategories();
  },[]);

  const handleChange=(e)=>{

    setForm({
      ...form,
      [e.target.name]:
      e.target.value
    });

  };

  const resetForm=()=>{

    setEditingId(null);

    setForm({
      name:"",
      description:""
    });

  };

  const submit=async(e)=>{

    e.preventDefault();

    try{

      if(editingId){

        await axios.put(
          `${API_URL}/api/categories/${editingId}`,
          form,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

      }else{

        await axios.post(
          `${API_URL}/api/categories`,
          form,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

      }

      resetForm();
      fetchCategories();

    }catch(err){
      alert(
        err.response?.data?.message ||
        "Gagal"
      );
    }

  };

  const edit=(category)=>{

    setEditingId(category.id);

    setForm({
      name:category.name,
      description:
      category.description || ""
    });

  };

  const remove=async(id)=>{

    if(
      !window.confirm(
        "Hapus kategori?"
      )
    ) return;

    try{

      await axios.delete(
        `${API_URL}/api/categories/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      fetchCategories();

    }catch(err){

      alert(
        err.response?.data?.message
      );

    }

  };

  return(

<div className="min-h-screen bg-gray-50">

<nav className="bg-white shadow">

<div className="max-w-6xl mx-auto p-4 flex justify-between">

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

<Folder/>

Kelola Kategori

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
onSubmit={submit}
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

{
editingId
?
"Edit Kategori"
:
"Tambah Kategori"
}

</h2>

<input
name="name"
placeholder="Nama kategori"
value={form.name}
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

<textarea
name="description"
placeholder="Deskripsi"
value={form.description}
onChange={handleChange}
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
bg-green-600
text-white
p-3
rounded
"
>

{
editingId
?
"Update"
:
"Tambah"
}

</button>

</form>

<div
className="
lg:col-span-2
space-y-4
"
>

{
categories.map(
(cat)=>(
<div
key={cat.id}
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
text-lg
"
>

{cat.name}

</h3>

<p>

{
cat.description ||
"Tidak ada deskripsi"
}

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
edit(cat)
}

className="
bg-blue-600
text-white
px-3
py-2
rounded
"

>

Edit

</button>

<button

onClick={()=>
remove(cat.id)
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

export default AdminCategoriesPage;