export type Todo = {
  id: number;
  text: string;
  todoStatus: Status;
};

type Status = "DONE" | "NONE";
