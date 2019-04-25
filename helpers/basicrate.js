function getRate(type){
  if(type == "suv")
    return "300000"
  else if (type == "sedan")
    return "350000"
  else if (type == "jeep")
    return "300000"  
  else
    return "250000"
}

module.exports = getRate