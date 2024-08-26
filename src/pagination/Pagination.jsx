const Pagination = ({totalPosts,postsPerPage,setCurrentPage}) => {
    let pages = []
    for(let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++){
        pages.push(i)
    }
  return (
    <div className="flex gap-4">
        {pages.map((page,i)=>{
            return <button className="bg-black text-white px-5 py-3 border rounded-md" key={i} onClick={()=>setCurrentPage(page)}>{page}</button>
        })}
    </div>
  )
}

export default Pagination