import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// import { UseAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';


import '../styles/room.scss';
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = UseAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();

  const [ isAnswered, setIsAnswered ] = useState(false);
  const [ isHighLighted, setIsHighLighted ] = useState(false);

  
  const roomId = params.id;
  
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que você deseja excluir a pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleQuestionAsAnswered(questionId: string) {
    setIsAnswered(!isAnswered)
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: isAnswered,
    });
  }
  
  async function handleHighLightQuestion(questionId: string) {
    setIsHighLighted(!isHighLighted)
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: isHighLighted,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button 
              isOutlined
              onClick={handleEndRoom}
            >
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && (
            <span>{questions.length} pergunta(s)</span>
          )}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id} 
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                <button
                  type="button"
                  onClick={() => handleQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Dar destaque à pergunta" />
                </button>

                {!question.isAnswered && (
                  <button
                  type="button"
                  onClick={() => handleHighLightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Remover pergunta" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Marcar pergunta como respondida" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
