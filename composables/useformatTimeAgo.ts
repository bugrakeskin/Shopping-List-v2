const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24))
  
  return diffInDays === 0 
    ? 'Bugün' 
    : diffInDays === 1 
      ? 'Dün' 
      : `${diffInDays} gün önce`
}
