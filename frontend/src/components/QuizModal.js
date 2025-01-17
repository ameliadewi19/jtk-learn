import React, { useState, useEffect } from 'react';
import { Accordion, Card, Dropdown } from "react-bootstrap";

const QuizModal = ({ show, onClose, onSubmit, initialData }) => {
    const defaultQuestions = [
        { nama_pertanyaan: '', konten_pertanyaan: '', jenis_pertanyaan: 'pilihan_ganda' },
        { nama_pertanyaan: '', konten_pertanyaan: '', jenis_pertanyaan: 'jawaban_singkat' },
        { nama_pertanyaan: '', konten_pertanyaan: '', jenis_pertanyaan: 'operasi_matematika' }
    ];

    const defaultAnswers = [
        [{ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' }, { nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' }],
        [{ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' }],
        [{ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' }]
    ];

    const [quizName, setQuizName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [questions, setQuestions] = useState(defaultQuestions);
    const [answers, setAnswers] = useState(defaultAnswers);

    useEffect(() => {
        if (initialData) {
            setQuizName(initialData.nama_quiz || '');
            setDescription(initialData.deskripsi_quiz || '');
            setDuration(initialData.durasi || '');
            setQuestions(initialData.pertanyaan || defaultQuestions);
            setAnswers(initialData.jawaban || defaultAnswers);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            id_course: 1,
            nama_quiz: quizName,
            deskripsi_quiz: description,
            durasi: duration,
            pertanyaan: questions,
            jawaban: answers,
        };
        onSubmit(formData);
        onClose();
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (qIndex, aIndex, field, value) => {
        const newAnswers = [...answers];
        newAnswers[qIndex][aIndex][field] = value;
        setAnswers(newAnswers);
    };

    const addAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers[index].push({ nama_jawaban: '', konten_jawaban: '', status_jawaban: 'benar' });
        setAnswers(newAnswers);
    };

    const removeAnswer = (qIndex, aIndex) => {
        const newAnswers = [...answers];
        newAnswers[qIndex].splice(aIndex, 1);
        setAnswers(newAnswers);
    };

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
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">Name</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control custom-input"
                                        value={quizName}
                                        onChange={(e) => setQuizName(e.target.value)}
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
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                        required
                                    />
                                    <span className="ms-2">minute(s)</span>
                                </div>
                            </div>
                            <hr style={{ height: '3px', color: '#000000', backgroundColor: '#000000', border: 'none' }} />
                            <div className="mb-3">
                                <Accordion className="custom-accordion">
                                    {questions.map((question, qIndex) => (
                                        <Card border='light' className="custom-accordion-card" key={qIndex}>
                                            <Accordion.Item eventKey={qIndex.toString()} className="custom-accordion-item">
                                                <Card.Header>
                                                    <Accordion.Header>
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
                                                        {answers[qIndex].map((answer, aIndex) => (
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
                                                                    style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px', width: '50%' }}
                                                                    placeholder='Content'
                                                                    required
                                                                />
                                                                <Dropdown onSelect={(value) => handleAnswerChange(qIndex, aIndex, 'status_jawaban', value)} style={{ width: '20%' }}>
                                                                    <Dropdown.Toggle
                                                                        variant="light"
                                                                        className="form-control"
                                                                        style={{ backgroundColor: '#EFEFEF', border: '1px solid black', borderRadius: '10px' }}
                                                                        disabled={question.jenis_pertanyaan !== 'pilihan_ganda'}
                                                                    >
                                                                        {answer.status_jawaban === 'benar' ? 'Correct' : 'Incorrect'}
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item eventKey="benar">Correct</Dropdown.Item>
                                                                        <Dropdown.Item eventKey="salah">Incorrect</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                                <i
                                                                    className={`fas fa-trash-alt fa-lg ms-2 ${answers[qIndex].length === 1 ? 'text-muted' : 'text-danger'}`}
                                                                    onClick={answers[qIndex].length > 1 ? () => removeAnswer(qIndex, aIndex) : null}
                                                                    style={{ cursor: answers[qIndex].length > 1 ? 'pointer' : 'not-allowed' }}
                                                                ></i>
                                                            </div>
                                                        ))}
                                                        <button type="button" className="custom-add-quiz-button mt-2" onClick={() => addAnswer(qIndex)}>Add Answer</button>
                                                    </Card.Body>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Card>
                                    ))}
                                </Accordion>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-danger fw-bold me-3 equal-width-button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-danger fw-bold equal-width-button">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizModal;