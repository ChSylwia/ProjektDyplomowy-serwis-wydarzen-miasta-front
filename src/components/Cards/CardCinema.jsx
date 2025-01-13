import { useNavigate } from 'react-router-dom'

function CardCinema({ movie }) {
  const navigate = useNavigate()
  const handleClickRedireict = () => {
    navigate(`/events/details/localEventDetails/${movie.id}`)
  }
  return (
    <div className='card card-side shadow-xl bg-tertiary'>
      <figure>
        <img src={movie.image} alt={movie.title} className='h-full' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{movie.title}</h2>
        <p>{movie.description}</p>
        <div className='card-actions justify-end'>
          <button
            className='btn btn-primary bg-primary text-white hover:bg-primary/90'
            onClick={handleClickRedireict}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardCinema
