import { useParams } from 'react-router';
function Room() {
  let { room_id } = useParams();
  return (
    <div>
      {`this is room ${room_id}`}
    </div>
  );
}

export default Room;
