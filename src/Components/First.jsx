import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./prebuiltComponent/Loader";

const First = () => {
  const home_url = "http://localhost:3000/";

  const [products, setProducts] = useState([]);
  const [show] = useState(10);
  const [page, setPage] = useState(2);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(null);
  const fetchData = async () => {
    setLoading(true);
    const data = await fetch("https://dummyjson.com/products?limit=100");
    const formatedData = await data.json();
    if (data && formatedData.products) {
      setProducts(formatedData.products);
      setPageIndex(10);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pageHandler = (selectedPage) => {
    console.log(selectedPage);
    if (
      selectedPage >= 1 &&
      selectedPage <= products.length / page &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };

  return (
    <>
      <Link to={home_url} class="inline-flex text-black bg-primary-600">
        Back to Homepage
      </Link>

      <h1 className="text-3xl font-bold underline text-blue-400">
        First Component
      </h1>
      <h3>pagination system control</h3>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {products.length > 0 &&
              products.slice(page * show - show, page * show).map((prod) => {
                return (
                  <div
                    key={prod.id}
                    style={{
                      width: "23%",
                      height: "20%",
                      background: "coral",
                      marginTop: "6px",
                      border: "2px solid black",
                      borderRadius: "10px",
                    }}
                  >
                    <div>
                      <span>{prod.id}</span>

                      <img
                        src={prod.images[0]}
                        style={{ width: "100%", height: "100%" }}
                        alt={prod.id}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {products.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <span
                onClick={() => {
                  pageHandler(page - 1);
                }}
              >
                ◀
              </span>
              {[...Array(pageIndex)].map((_, i) => {
                return (
                  <span
                    key={i}
                    style={{ margin: "4px" }}
                    onClick={() => {
                      pageHandler(i + 1);
                    }}
                  >
                    {i + 1}
                  </span>
                );
              })}
              <span
                onClick={() => {
                  pageHandler(page + 1);
                }}
              >
                ▶
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default First;
