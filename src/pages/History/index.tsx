import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { HistoryContainer, HistoryList, Status } from "./styles";


export function History() {
    const { cycles } = useContext(CyclesContext);
    return (
        <HistoryContainer>
            <h1>Meu Histórico</h1>
            <HistoryList>
                <table>
                    <tr>
                        <th>Tarefa</th>
                        <th>Duração</th>
                        <th>Início</th>
                        <th>Status</th>
                    </tr>
                    <tbody>
                        {cycles.map((cycle) => {
                            return (
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minutesAmount} minutos</td>
                                    <td>{formatDistanceToNow(new Date(cycle.startDate), {
                                        addSuffix: true,
                                        locale: ptBR
                                    })}</td>
                                    <td>
                                        {cycle.finishedDate &&
                                            (<Status statusColors="green">Concluído</Status>)
                                        }
                                        {
                                            cycle.interruptedDate &&
                                            (<Status statusColors="red">Interrompido</Status>)
                                        }
                                        {
                                            (!cycle.finishedDate && !cycle.interruptedDate) &&
                                            (<Status statusColors="yellow">Em Andamento</Status>)
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )

}
