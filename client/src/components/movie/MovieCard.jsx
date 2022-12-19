import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
	const navigate = useNavigate();

	return (
		<div className="flex justify-center">
			<div>
				<div className={styles.image_container} onClick={() => navigate(`details/${movie._id}`)}>
					<div>
						<img className={styles.img} src={movie.images.poster} alt={movie.title} />
					</div>
					<p className={styles.movie_title}>
						{movie?.title?.length > 35 ? `${movie?.title?.substr(0, 35)} . . .` : movie?.title}
					</p>
				</div>
			</div>
		</div>
	);
};

const styles = {
	book_show_btn: "w-full h-[35px] inline-block px-4 py-1.5 bg-blue-600 text-white font text-xs",
	view_details_btn: "w-full h-[35px] inline-block px-4 py-1.5 bg-mygray text-white font text-xs rounded-sm",
	image_container: "w-[130px] md:w-[230px] h-auto relative cursor-pointer",
	img: "object-cover rounded-xl hover:opacity-70",
	movie_title: "text-blue-300 text-lg px-2 md:text-xl my-1",
};

export default MovieCard;
