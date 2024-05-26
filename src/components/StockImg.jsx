import { useState, useEffect } from "react";
// import './Addimg.css'; // Make sure this CSS file exists

function StockImg({ onAddImage }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Fetch categories from the server when component mounts
    fetch("http://localhost:3001/categories") // Update the URL with your server URL
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  // const categories = [
  //   {
  //     id: 1,
  //     name: "Pets",
  //     img: "https://i.pinimg.com/236x/c2/6e/e4/c26ee41e4c5778e84aa835aef082f8c4.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Pets",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmi_-UScGv_Wt0l9Zw1FAW83g4SgAgEbSZ-0HIiFC_OQ&s",
  //   },
  //   {
  //     id: 3,
  //     name: "Pets",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTveerLsNLxVPCL02lJzaYF2ishRBrh0sDtceZ7pefS0w&s",
  //   },
  //   {
  //     id: 4,
  //     name: "Cars",
  //     img: "https://img.freepik.com/premium-photo/pixel-art-car-traveling-down-mountain-road-sunset_899449-275975.jpg",
  //   },
  //   {
  //     id: 5,
  //     name: "Cars",
  //     img: "https://wallpapers.com/images/featured/car-anime-n9y7wos0kv3fchgl.jpg",
  //   },
  //   {
  //     id: 6,
  //     name: "Cars",
  //     img: "https://thenewswheel.com/wp-content/uploads/2016/11/Initial-D-Toyota-AE86-popular-cars-from-Japanese-anime-steet-racing--760x418.jpg",
  //   },
  //   {
  //     id: 7,
  //     name: "Universe",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1a0txd0iZz9RNZbjofPUyWxKw9x8sHS8Kh8dmM3iMgw&s",
  //   },
  //   {
  //     id: 8,
  //     name: "Universe",
  //     img: "https://i.pinimg.com/474x/33/f7/de/33f7de05d44754d0e0158c00744385d4.jpg",
  //   },
  //   {
  //     id: 9,
  //     name: "Universe",
  //     img: "https://cdn.wallpapersafari.com/63/0/RMaSVE.jpg",
  //   },
  // ];

  return (
    <>
      <div className="stock-container">
        {/* <NavLink className="cross-btn" to='/'>
                    <ArrowBackIosNewRoundedIcon />
                </NavLink> */}
      </div>
      <div className="header-center" onClick={() => setOpen(!open)}>
      <img
            src="/stock.svg"
            className="w-10 p-1 cursor-pointer hover:bg-gray-200 h-full m-auto"
           
          ></img>
        <h4 style={{ textAlign: "center", color: "grey", cursor: "pointer" }}>
          Stock Photos
        </h4>
        {/* <input type='text' placeholder="Search for stock images" /> */}
        {/* <SearchIcon /> */}
      </div>
      {open && (
        <div className="stock-img" style={{ height: "250px" }}>
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={(e) => onAddImage(e, category.img)}
              className="custom-img"
              style={{ height: "100px", position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  zIndex: "1",
                  color: category.textColor,
                  fontSize: "100px",
                }}
              >
                <img src={category.img}></img>
              </div>
              <p style={{ color: "white", position: "absolute", zIndex: "2" }}>
                {category.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default StockImg;
