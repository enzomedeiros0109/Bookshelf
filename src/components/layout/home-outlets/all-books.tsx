import { useQuery } from "@tanstack/react-query"
import OutletHeader from "./outlet-header"
import { getBooks } from "@/api/api"
import type { BookSchema } from "@/schemas/db/books-schema"

type Props = {}

const AllBooks = ({ }: Props) => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["getBooks", "Project Hail Mary"],
    queryFn: () => getBooks("Project Hail Mary"),

    // Não repetir automaticamente quando houver erro
    retry: false,

    // Manter os dados em cache por 10 minutos
    staleTime: 1000 * 60 * 10,
    
    // Evitar novas consultas por foco ou reconexão
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryOnMount: false,
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <OutletHeader />
      <div className="grid grid-cols-3 gap-8">
        {data?.map((book: BookSchema) => (
          <div key={book.externalId}>
            <p>{book.name}</p>

            <p>{book.authors.join(", ") || "Autor desconhecido"}</p>

            <p>{book.genres.join(", ") || "Sem categorias"}</p>

            {book.cover && (
              <img src={book.cover} alt={`Capa de ${book.name}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllBooks
