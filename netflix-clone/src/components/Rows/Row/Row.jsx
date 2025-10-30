import React, { useEffect, useState } from "react";
import "./Row.css";
import axios from "../../../utils/axios";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";

const Rows = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const base_url = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching:", fetchUrl);
        const request = await axios.get(fetchUrl);
        console.log("Fetched data:", request.data);
        setMovies(request.data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchData();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name)
        .then((url) => {
          if (!url) {
            console.log("Trailer not found");
            return;
          }
          const urlParams = new URLSearchParams(new URL(url).search);
          const videoId = urlParams.get("v");
          setTrailerUrl(videoId);
        })
        .catch((error) => console.error("Trailer fetch error:", error));
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row_posters">
        {movies.map((movie, index) => {
          const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
          if (!imagePath) return null; // skip missing images

          return (
            <img
              key={index}
              onClick={() => handleClick(movie)}
              src={`${base_url}${imagePath}`}
              alt={movie.name}
              className={`row_poster ${isLargeRow ? "row_posterLarger" : ""}`}
            />
          );
        })}
      </div>

      {trailerUrl && (
        <div style={{ padding: "40px" }}>
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}
    </div>
  );
};

export default Rows;
