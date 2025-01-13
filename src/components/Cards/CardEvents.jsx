import { useNavigate } from 'react-router-dom'

function CardEvents({ item }) {
  const navigate = useNavigate()
  const handleClickRedireict = () => {
    navigate(`/events/details/localEventDetails/${item.id}`)
  }
  return (
    <div key={item.id} className='card bg-tertiary shadow-xl'>
      <figure>
        <img src={item.image} alt={item.title} className='h-full' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{item.title}</h2>
        <p>{item.content}</p>
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

export default CardEvents
