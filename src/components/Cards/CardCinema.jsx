function CardCinema({ movie }) {
  return (
    <div className='card card-side bg-base-100 shadow-xl'>
      <figure>
        <img src={movie.image} alt={movie.title} />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{movie.title}</h2>
        <p>{movie.description}</p>
        <div className='card-actions justify-end'>
          <button className='btn btn-primary'>Show more</button>
        </div>
      </div>
    </div>
  )
}

export default CardCinema
