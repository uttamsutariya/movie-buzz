import BackButton from "../../util/BackButton";

const styles = {
	nav: "flex justify-around items center p-3 bg-slate-800 shadow-xl w-full sticky top-0 z-50 relative",
	nav_h1: "text-2xl font-semibold",
};

const Navbar = ({ child }) => {
	return (
		<nav className={styles.nav}>
			<BackButton />
			{child}
		</nav>
	);
};

export default Navbar;
