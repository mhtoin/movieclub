export default function MovieCard({ backgroundPath }: { backgroundPath: string }) {
    return (
        <div className="-z-0 card w-96 h-96 rounded-box" style={{
            backgroundImage: `url(${backgroundPath})`
        }}>

        </div>
    )
}