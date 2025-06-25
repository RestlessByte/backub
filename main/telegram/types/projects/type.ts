export interface IProjects {
  id: number; // serial в PostgreSQL является автоинкрементным целым числом (primary key)
  user_id: number; // bigint в PostgreSQL соответствует целому числу, предполагается, что это не NULL
  deadline: string; // bpchar в PostgreSQL соответствует строке фиксированной длины
  timestamp: Date; // timestamp в PostgreSQL соответствует объекту Date в TypeScript
  technical_specification: string; // bpchar в PostgreSQL соответствует строке фиксированной длины
  status: bigint; // bpchar в PostgreSQL соответствует строке фиксированной длины
  price: bigint; // bpchar в PostgreSQL соответствует строке фиксированной длины
  rows: any[]
}