import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
	const navigate = useNavigate();

	return (
		<div className="flex justify-center">
			<div>
				<div className={styles.image_container}>
					<img className="object-cover" src={movie.images.poster} alt="" />
					<div className="absolute bottom-0 left-0 w-full">
						{movie.status === "released" ? (
							<>
								<button
									onClick={() => navigate(`/shows/${movie._id}`)}
									className={styles.book_show_btn}
								>
									Book Show
								</button>
								<button
									onClick={() => navigate(`details/${movie._id}`)}
									className={styles.view_details_btn}
								>
									View Details
								</button>
							</>
						) : (
							<button onClick={() => navigate(`details/${movie._id}`)} className={styles.book_show_btn}>
								View Details
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const styles = {
	book_show_btn: "w-full h-[35px] inline-block px-4 py-1.5 bg-blue-600 text-white font text-xs",
	view_details_btn: "w-full h-[35px] inline-block px-4 py-1.5 bg-mygray text-white font text-xs rounded-sm",
	image_container: "rounded-lg w-[230px] h-auto overflow-hidden relative",
};

export default MovieCard;
