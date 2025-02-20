import { useNavigate } from 'react-router-dom'

function CardCinema({ movie }) {
  const navigate = useNavigate()
  const handleClickRedirect = () => {
    navigate(`/events/details/localEventDetails/${movie.id}`, { state: { event: movie } })
  }
  const truncateText = (text, wordLimit) => {
    if (!text) return ''
    const words = text.split(' ')
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text
  }
  return (
    <div className='card card-side shadow-xl  bg-white z-10 min-h-80 h-full'>
      <figure className='h-full w-full min-h-48'>
        <img src={movie.image} alt={movie.title} className='w-full h-full object-cover' />
      </figure>
      <div className='card-body  bg-white'>
        <h2 className='card-title'>{movie.title}</h2>
        <p>{truncateText(movie.description, 10)}</p>
        <div className='card-actions justify-end'>
          <button
            className='btn btn-primary bg-primary text-white hover:bg-primary/90'
            onClick={handleClickRedirect}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardCinema
