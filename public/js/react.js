'use-strict'
const React = window.React;
const ReactDOM = window.ReactDOM;
const { DragDropContext, Draggable, Droppable } = window.ReactBeautifulDnd;
const styled = window.styled

let url;
url = 'https://hidden-fortress-08833.herokuapp.com'
// url = 'http://localhost:8080'

const TaskContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(21,27,38,.15);
  align-items: center;
  padding: 10px;
  background-color: ${props => (props.isDragging ? '#75e6e0' : 'white')};
  margin-bottom: 8px;
  display: grid;
  grid-template-columns: 1fr 20px;
`




const TaskEdit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const TaskOperation = styled.div`
  text-decoration: none;
  padding: 5px;
  color: #bcbcbc;
  transition: fill 0.25s;
  opacity: 0.3;

  &:hover {
    color: lightseagreen;
    opacity: 1;
  }
`

const TaskDeleteBtn = styled.button`
  background-color: Transparent;
  background-repeat:no-repeat;
  border: none;
  cursor:pointer;
  overflow: hidden;
  outline:none;
  padding: 0px;
`

class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>

        {(provided, snapshot) => (

          <TaskContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isDragging={snapshot.isDragging}>
            {this.props.task.content}
            {
              <TaskEdit>
                <form method='post' action={`${window.location.pathname}/${this.props.columnId}/tasks/${parseInt(this.props.task.id.match(/\d+/)[0], 10)}/delete`}>
                  <TaskDeleteBtn type='submit'><TaskOperation className='fa fa-trash'></TaskOperation></TaskDeleteBtn>
                </form>
                <a href={`${window.location.pathname}/${this.props.columnId}/tasks/${parseInt(this.props.task.id.match(/\d+/)[0], 10)}/edit`}>
                  <TaskOperation className="fa fa-pencil-square-o"></TaskOperation>
                </a>
              </TaskEdit>
            }

          </TaskContainer>
        )}
      </Draggable>
    )
  }
}

const ColumnContainer = styled.div`
  margin: 8px;
  background-color: #f6f8f9;
  border-radius: 7px;
  width: 280px;
  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  padding: 8px;
  text-align: center;
  font-weight: 500;
`
const TaskList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDraggingOver ? '#f0f3f6' : 'inherit')};

  flex-grow: 1;
  min-height: 100px;
`

const TaskAdd = styled.a`
  display: flex;
  text-decoration: none;
  outline: none;
  font-size: 22px;
  padding: 3px;
  height: 32px;
  margin: 8px;
  background-color: white;
  color: lightseagreen;
  border: 1px solid lightgrey;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(21,27,38,.15);
  align-items: center;
  justify-content: center;
`

const ColHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 22px;
  padding: 5px;
  margin: 8px;
  align-items: center;
`

const ColumnOperation = styled.div`
  margin-right: 2px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`


class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (

          <ColumnContainer {...provided.draggableProps} ref={provided.innerRef}>


            <ColHeader>
              <Title {...provided.dragHandleProps}>{this.props.column.title}</Title>
                <ColumnOperation>
                  <form method='post' action={`${window.location.pathname}/${parseInt(this.props.column.id.match(/\d+/)[0], 10)}/delete`}>
                      <TaskDeleteBtn type='submit'><TaskOperation className='fa fa-trash'></TaskOperation></TaskDeleteBtn>
                  </form>
                  <a href={`${window.location.pathname}/${parseInt(this.props.column.id.match(/\d+/)[0], 10)}/edit`}>
                      <TaskOperation className="fa fa-pencil-square-o"></TaskOperation>
                  </a>
                </ColumnOperation>
            </ColHeader>


            <TaskAdd className="fa fa-plus" href={`${window.location.pathname}/${parseInt(this.props.column.id.match(/\d+/)[0], 10)}/tasks/create`}></TaskAdd>

            <Droppable type='task' droppableId={this.props.column.id}>
              {(provided, snapshot) => (

                <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>

                  {this.props.tasks.map((task, index) => (
                    <Task key={task.id} columnId={parseInt(this.props.column.id.match(/\d+/)[0], 10)} task={task} index={index} />
                  ))}


                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>

          </ColumnContainer>

        )}
      </Draggable>
    )
  }
}

const BoardContainer = styled.div`
  display: flex;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif;
  background-color: #f6f8f9;
`

class App extends React.Component {

  state = this.getState()

  getState() {
    var scripts = document.getElementsByTagName('script')
    return JSON.parse(scripts[scripts.length - 1].getAttribute('state')).state
  };

  onDragStart = start => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId)
    this.setState({ homeIndex })
  }

  onDragEnd = result => {
    document.body.style.color = 'inherit'
    document.body.style.backgroundColor = 'inherit'
    this.setState({ homeIndex: null })

    const { destination, source, draggableId, type } = result

    // console.log('destination: ', destination)
    // console.log('source: ', source)
    // console.log('draggableId: ', draggableId)
    // console.log('type: ', type)

    if (!destination) { return }

    if (destination.droppableId === source.droppableId && destination.index === source.index) { return }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = { ...this.state, columnOrder: newColumnOrder }

      this.setState(newState)

      const columnResult = { source, destination, draggableId, newColumnOrder }

      // TODO: persist order state to database here
      fetch(`${url}/columns/update`, {
        method: 'POST',
        body: JSON.stringify(columnResult),
        headers: { 'Content-Type': 'application/json' }
      })
        .catch(err => console.log(err))

      return
    }

    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = { ...start, taskIds: newTaskIds }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        }
      }

      this.setState(newState)

      // TODO: persist order state to database here
      fetch(`${url}/columns/update`, {
        method: 'POST',
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      })
        .catch(err => console.log(err))

      return
    }

    // moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }

    this.setState(newState)

    // TODO: persist order state to database here
    fetch(`${url}/columns/update`, {
      method: 'POST',
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (

            <BoardContainer {...provided.droppableProps} ref={provided.innerRef}>

              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId]
                const tasks = column.taskIds.map(taskId => this.state.tasks[taskId])
                return <Column key={column.id} column={column} tasks={tasks} index={index} />
              })}

              {provided.placeholder}
            </BoardContainer>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

const domContainer = document.querySelector('#board');
ReactDOM.render(<App />, domContainer);
