import { Library, LibraryBig } from "lucide-react"

type Props = {}

const NotFound = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-9xl">404</h1>
      <h2 className="text-8xl">Page Not Found</h2>
      
    </div>
  )
}

export default NotFound