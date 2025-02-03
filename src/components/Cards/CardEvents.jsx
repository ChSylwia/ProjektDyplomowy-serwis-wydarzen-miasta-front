import { useNavigate } from 'react-router-dom'

function CardEvents({ item }) {
  const navigate = useNavigate()
  const handleClickRedirect = () => {
    // Pass the full event data as state
    navigate(`/events/details/localEventDetails/${item.id}`, { state: { event: item } })
  }
  const truncateText = (text, wordLimit) => {
    if (!text) return ''
    const words = text.split(' ')
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text
  }
  return (
    <div key={item.id} className='card bg-tertiary bg-white shadow-xl z-10'>
      <figure>
        <img src={item.image} alt={item.title} className='h-full' />
      </figure>
      <div className='card-body bg-tertiary bg-white'>
        <h2 className='card-title'>{item.title}</h2>
        <p>{truncateText(item.description, 10)}</p>
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

export default CardEvents
