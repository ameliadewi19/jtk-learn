import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Card, Dropdown } from "react-bootstrap";
import { FaGripVertical } from 'react-icons/fa';

const QuizModal = ({ show, onClose, onSubmit, initialData }) => {
    const { id } = useParams();
    const [quizData, setQuizData] = useState({
        quizName: '',
        description: '',
        duration: '',
        questions: []
    });
    const [draggedQuestionIndex, setDraggedQuestionIndex] = useState(null);

    const defaultAnswers = [
        [{ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' }, { nama_jawaban: '', konten_jawaban: '', status_jawaban: 'salah' }],
        [{ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' }],
        [{ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' }]
    ];

    const defaultQuestions = [
        { nama_pertanyaan: '', konten_pertanyaan: '', jenis_pertanyaan: 'pilihan_ganda', order: 0, jawaban: defaultAnswers[0] },
        { nama_pertanyaan: '', konten_pertanyaan: '', jenis_pertanyaan: 'jawaban_singkat', order: 1, jawaban: defaultAnswers[1] },
        { nama_pertanyaan: '', konten_pertanyaan: '', jenis_pertanyaan: 'operasi_matematika', order: 2, jawaban: defaultAnswers[2] }
    ];

    useEffect(() => {
        if (initialData) {
            setQuizData({
                quizName: initialData.nama_quiz || '',
                description: initialData.deskripsi_quiz || '',
                duration: initialData.durasi || '',
                questions: initialData.pertanyaan || []
            });
        } else {
            setQuizData({
                quizName: '',
                description: '',
                duration: '',
                questions: defaultQuestions
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            id_quiz: initialData?.id_quiz,
            id_course: id,
            nama_quiz: quizData.quizName,
            deskripsi_quiz: quizData.description,
            durasi: quizData.duration,
            pertanyaan: quizData.questions,
        };
        onSubmit(formData);
        onClose();
    };

    const handleDragStart = (index) => {
        setDraggedQuestionIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (index) => {
        if (draggedQuestionIndex === null) return;
        const newQuestions = [...quizData.questions];
        const draggedQuestion = newQuestions[draggedQuestionIndex];
        newQuestions.splice(draggedQuestionIndex, 1);
        newQuestions.splice(index, 0, draggedQuestion);
        newQuestions.forEach((question, idx) => {
            question.order = idx;
        });
        setDraggedQuestionIndex(null);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleDragEnd = () => {
        setDraggedQuestionIndex(null);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index][field] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleAnswerChange = (qIndex, aIndex, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].jawaban[aIndex][field] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const addAnswer = (index) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index].jawaban.push({ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' });
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const removeAnswer = (qIndex, aIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].jawaban.splice(aIndex, 1);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    // Sort questions by updated 'order'
    const orderedQuestions = [...quizData.questions].sort((a, b) => a.order - b.order);

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            style={show ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}}
        >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
                <div className="modal-content" style={{ padding: '32px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{initialData ? 'Edit Quiz' : 'Add Quiz'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <div className="mb-3 row quiz-form">
                                <label className="col-sm-2 col-form-label">Name</label>
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control custom-input w-100"
                                        value={quizData.quizName}
                                        onChange={(e) => setQuizData({ ...quizData, quizName: e.target.value })}
                                        style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={quizData.description}
                                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                    style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Duration</label>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control no-spinner"
                                        value={quizData.duration}
                                        onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })}
                                        style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                        required
                                    />
                                    <span className="ms-2">minute(s)</span>
                                </div>
                            </div>
                            <hr style={{ height: '3px', color: '#000000', backgroundColor: '#000000', border: 'none' }} />
                            <div className="mb-3">
                                <Accordion className="custom-accordion">
                                    {orderedQuestions.map((question, qIndex) => (
                                        <Card
                                            border='light'
                                            className="custom-accordion-card"
                                            key={qIndex}
                                            draggable
                                            onDragStart={() => handleDragStart(qIndex)}
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDrop(qIndex)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <Accordion.Item eventKey={qIndex.toString()} className="custom-accordion-item">
                                                <Card.Header>
                                                    <Accordion.Header onClick={() => console.log(qIndex)}>
                                                        <FaGripVertical style={{ cursor: 'move', marginRight: '10px' }} />
                                                        {question.jenis_pertanyaan === 'pilihan_ganda' && 'Multiple Choice Question'}
                                                        {question.jenis_pertanyaan === 'jawaban_singkat' && 'Short Answer Question'}
                                                        {question.jenis_pertanyaan === 'operasi_matematika' && 'Mathematic Question'}
                                                    </Accordion.Header>
                                                </Card.Header>
                                                <Accordion.Body>
                                                    <Card.Body>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            value={question.nama_pertanyaan}
                                                            onChange={(e) => handleQuestionChange(qIndex, 'nama_pertanyaan', e.target.value)}
                                                            style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                                            placeholder='Name'
                                                            required
                                                        />
                                                        <textarea
                                                            className="form-control mb-3"
                                                            rows="2"
                                                            value={question.konten_pertanyaan}
                                                            onChange={(e) => handleQuestionChange(qIndex, 'konten_pertanyaan', e.target.value)}
                                                            style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                                            placeholder='Content'
                                                            required
                                                        ></textarea>
                                                        <span style={{ color: '#696969' }}>Answer</span>
                                                        {question.jawaban?.map((answer, aIndex) => (
                                                            <div key={aIndex} className="d-flex align-items-center mt-2">
                                                                <input
                                                                    type="text"
                                                                    className="form-control me-2"
                                                                    value={answer.nama_jawaban}
                                                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, 'nama_jawaban', e.target.value)}
                                                                    style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px', width: '30%' }}
                                                                    placeholder='Name'
                                                                    required
                                                                />
                                                                <input
                                                                    type="text"
                                                                    className="form-control me-2"
                                                                    value={answer.konten_jawaban}
                                                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, 'konten_jawaban', e.target.value)}
                                                                    style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                                                    placeholder='Content'
                                                                    required
                                                                />
                                                                {question.jenis_pertanyaan === 'pilihan_ganda' && (
                                                                    <>
                                                                        <Dropdown
                                                                            onSelect={(value) => handleAnswerChange(qIndex, aIndex, 'status_jawaban', value)}
                                                                            align="start"
                                                                            style={{ width: '30%' }}
                                                                        >
                                                                            <Dropdown.Toggle
                                                                                variant="light"
                                                                                className="form-control"
                                                                                style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                                                            >
                                                                                {answer.status_jawaban === 'benar' ? 'Correct' : 'Incorrect'}
                                                                            </Dropdown.Toggle>
                                                                            <Dropdown.Menu>
                                                                                <Dropdown.Item eventKey="benar">Correct</Dropdown.Item>
                                                                                <Dropdown.Item eventKey="salah">Incorrect</Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                    </>
                                                                )}
                                                                {(question.jenis_pertanyaan !== 'operasi_matematika') && (
                                                                    <i
                                                                        className={`fas fa-trash-alt fa-lg ms-2 ${question.jawaban.length === 1 ? 'text-muted' : 'text-danger'}`}
                                                                        onClick={question.jawaban.length > 1 ? () => removeAnswer(qIndex, aIndex) : null}
                                                                        style={{ cursor: question.jawaban.length > 1 ? 'pointer' : 'not-allowed' }}
                                                                    ></i>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {question.jenis_pertanyaan !== 'operasi_matematika' && (
                                                            <button type="button" className="custom-add-quiz-button mt-2" onClick={() => addAnswer(qIndex)}>
                                                                Add Answer
                                                            </button>
                                                        )}
                                                    </Card.Body>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Card>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-danger fw-bold me-2 equal-width-button" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-danger fw-bold equal-width-button">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuizModal;