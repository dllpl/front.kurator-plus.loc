function StreamsByStreamLeader(streams,stream_leader_id){
  let my = streams.filter((item)=>{
    return (item.leaders.find(leader=>leader.id===stream_leader_id));
  });
  return my;
}

export default StreamsByStreamLeader;
