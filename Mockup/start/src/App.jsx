import { useEffect, useState } from "react";
// import { allCharacters, character } from "../data/data";
import NavBar, { Favourites, Search, SearchResult } from "./components/NavBar";
import CharacterList from "./components/CharacterList";
import CharacterDetail from "./components/CharacterDetail";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [favourites, setFavourites] = useState(() => JSON.parse(localStorage.getItem("FAVOURITES")) || []);
  const [count, setCount] = useState(0);


  // useEffect(() => {
  //    setIsLoading(true);
  //    fetch("https://rickandmortyapi.com/api/character")
  //    .then((res) => {
  //       if (!res.ok) throw new Error("something went wrong!!!");
  //       ***return res.json();
  //     })
  //    .then((data) => {
  //        setCharacters(data.results.slice(0,5))
  //    //  setIsLoading(false);
  //    })
  //    .catch((err) => {
  //    //  setIsLoading(false);
  //        toast.error(err.message);
  //    })
  //    .finally(() => setIsLoading(false));
  //  }, []);

  // useEffect(() => {
  //   async function fetchData(){
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch("https://rickandmortyapi.com/api/character");
  //       if (!res.ok) throw new Error("Something went wrong!");
  //       const data = await res.json();
  //       setCharacters(data.results.slice(0,5));
  //       //setIsLoading(false);
  //     } catch (err) {
  //       // FOR REAL PROJECT: err.response.data.message
  //       //setIsLoading(false);
  //       console.log(err.message);
  //       toast.error(err.message)
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   axios
  //     .get("https://rickandmortyapi.com/api/character")
  //     .then(({ data }) => {
  //       setCharacters(data.results.slice(0, 5));
  //     })
  //     .catch((err) => {
  //       console.log(err.response.data.error);
  //       toast.error(err.response.data.error);
  //     })
  //     .finally(() => setIsLoading(false));
  // }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${query}`,
          { signal }
        );
        setCharacters(data.results);
      } catch (err) {
        // fetch => err.name === "AbortError"
        // axios => axios.isCancel()
        if (!axios.isCancel()) {
          setCharacters([]);
          console.log(err.response.data.error);
          toast.error(err.response.data.error);
        }
        console.log(err.name);        
      } finally {
        setIsLoading(false);
      }
    }
    // if (query.length < 3) {
    //   setCharacters([]);
    //   return;
    // }
    fetchData();

    return () => {
      controller.abort();
    };

  }, [query]);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), 1000);
    // return function(){}
    return () => {
      clearInterval(interval);
    };
  }, [count]);

  useEffect(() => {
    localStorage.setItem("FAVOURITES", JSON.stringify(favourites))
  }, [favourites])

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleAddFavourite = (char) => {
    setFavourites((prevFav) => [...prevFav, char]);
  };

  const handleDeleteFavourite = (id) => {
    setFavourites((prevFav) => prevFav.filter((fav) => fav.id !== id));
  }

  const isAddToFavourite = favourites.map((fav) => fav.id).includes(selectedId);

  // console.log(favourites);
  // console.log(selectedId);

  return (
    <div className="app">
      <Toaster />
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult numOfResult={characters.length} />
        <Favourites favourites={favourites} onDeleteFavourite={handleDeleteFavourite} />
      </NavBar>
      <div className="main">
        <CharacterList
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
          selectedId={selectedId}
        />
        <CharacterDetail
          selectedId={selectedId}
          onAddFavourite={handleAddFavourite}
          isAddToFavourite={isAddToFavourite}
        />
      </div>
    </div>
  );
}

export default App;
