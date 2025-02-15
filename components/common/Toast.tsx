import type { Movie } from "@prisma/client";
import { Button } from "components/ui/Button";
import { toast } from "sonner";

export const Toast = (message: string, _shortlistId: string, movie: Movie) => {
	return toast.custom(
		(t) => (
			<div className="z-50 h-[500px] w-[500px] bg-background border text-foreground text-sm p-5 rounded-md flex flex-col justify-between items-center gap-5">
				<div className="text-sm text-foreground">{message}</div>
				<div className="flex gap-5 ">
					<div className="flex flex-col">
						<img
							src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
							alt=""
							width={"150"}
							className={"primary-img w-[150px] h-auto 2xl:w-[150px]"}
						/>
					</div>
					<Button variant={"outline"} onClick={() => toast.dismiss(t)}>
						Close
					</Button>
				</div>
			</div>
		),
		{
			duration: Number.POSITIVE_INFINITY,
		},
	);
};
