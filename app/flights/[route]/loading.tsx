export default function LoadingFlightResults() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <span className="mx-3">→</span>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="flex gap-4">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Flight results placeholders */}
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-4 rounded-lg shadow mb-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="h-5 w-12 bg-gray-200 rounded mb-1 mx-auto"></div>
                <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
              </div>
              
              <div className="text-center">
                <div className="h-4 w-24 bg-gray-200 rounded mb-1 mx-auto"></div>
                <div className="border-t border-dashed w-20 mx-auto mt-1"></div>
              </div>
              
              <div className="text-center">
                <div className="h-5 w-12 bg-gray-200 rounded mb-1 mx-auto"></div>
                <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
            
            <div>
              <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 