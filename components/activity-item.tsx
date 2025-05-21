interface ActivityItemProps {
  color: string
}

export function ActivityItem({ color }: ActivityItemProps) {
  return (
    <div className="flex">
      <div className="mr-4 relative">
        <div className={`h-3 w-3 rounded-full ${color} z-10 relative`}></div>
        <div className="absolute top-3 bottom-0 left-1.5 w-px bg-gray-200"></div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800 mb-1">
          Lorem ipsum dolor sit amet consectetur adipiscing elit, in mi felis senectus etiam nec nam, dui ac mus
          maecenas congue sem. Urna ante nisi leo ultricies natoque erat cursus auctor ac...
        </p>
        <div className="flex items-center text-xs text-gray-400">
          <span>09:17:01 AM</span>
          <button className="ml-4 text-gray-500">See thread</button>
        </div>
      </div>
    </div>
  )
}
