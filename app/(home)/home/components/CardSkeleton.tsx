export const CardSkeleton = () => {
	return (
		<div className="card md:card-side w-11/12 lg:w-[780px] lg:h-[740px] p-5 ">
			<div className="w-full h-[300px] sm:h-full sm:w-1/2 bg-gray-300 rounded-md " />
			<div className="card-body sm:w-1/2 p-5">
				<h2 className="card-title text-2xl text-left">
					<div className="h-2 w-1/3 bg-gray-300 rounded-md" />
				</h2>
				<div className="avatar">
					<div className="w-12 rounded-full">
						<div className="h-12 w-12 bg-gray-300 rounded-full " />
					</div>
				</div>
				<h3 className="text-sm italic">
					<div className="h-1 w-12 bg-gray-300 rounded-md" />
				</h3>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<title>Star</title>
					<g fill="none">
						<path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
						<path
							fill="currentColor"
							d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3h8Zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094l9.9-9.9Z"
						/>
					</g>
				</svg>
			</div>
		</div>
	);
};
