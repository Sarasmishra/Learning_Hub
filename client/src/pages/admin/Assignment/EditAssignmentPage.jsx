import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi';
import { useEditFileAssignmentMutation, useFetchFileAssignmentByIdQuery } from '@/features/api/fileAssignmentApi';
import { useEditQuizAssignmentMutation, useFetchQuizAssignmentByIdQuery } from '@/features/api/quizAssignmentApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const EditAssignmentPage = () => {
  const { id } = useParams();
  const [assignmentType, setAssignmentType] = useState('file');
  const [courseId, setCourseId] = useState('');

  const [fileAssignmentData, setFileAssignmentData] = useState({
    difficulty: 'easy',
    title: '',
    detailedInstruction: '',
    deadline: '',
    gradingCriteria: '',
    
  });

  const [quizAssignmentData, setQuizAssignmentData] = useState({
    difficulty: 'easy',
    title: '',
    detailedInstruction: '',
    deadline: '',
    quizQuestions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
    duration: 30,
    passingMarks: 50,
    maxAttempts: 1,
  });

  const { data: fileData } = useFetchFileAssignmentByIdQuery(id, { skip: !id });
  const { data: quizData } = useFetchQuizAssignmentByIdQuery(id, { skip: !id });
  const { data: courses, isLoading,isError } = useGetCreatorCourseQuery();
  const [editFileAssignment] = useEditFileAssignmentMutation();
  const [editQuizAssignment] = useEditQuizAssignmentMutation();

  useEffect(() => {
    if (quizData?.course) {
      setAssignmentType('quiz');
      setCourseId(quizData?.courseId);
      setQuizAssignmentData({
        ...quizData,
        deadline: quizData?.deadline?.slice(0, 16),
        quizQuestions: quizData.quizQuestions || [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
      });
    } else if (fileData?.course) {
      setAssignmentType('file');
      console.log("filedata - ",fileData.course._id)
      setCourseId(fileData?.course._id);
      setFileAssignmentData({
        ...fileData,
        deadline: fileData?.deadline?.slice(0, 16),
      
      });
    }
  }, [fileData, quizData]);

  const handleFileInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFileAssignmentData({ ...fileAssignmentData, file: files[0] });
    } else {
      setFileAssignmentData({ ...fileAssignmentData, [name]: value });
    }
  };

  const handleQuizInputChange = (e) => {
    const { name, value } = e.target;
    setQuizAssignmentData({ ...quizAssignmentData, [name]: value });
  };

  const handleQuizQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizAssignmentData.quizQuestions];
    updatedQuestions[index][field] = value;
    setQuizAssignmentData({ ...quizAssignmentData, quizQuestions: updatedQuestions });
  };

  const handleQuizOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...quizAssignmentData.quizQuestions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuizAssignmentData({ ...quizAssignmentData, quizQuestions: updatedQuestions });
  };

  const addQuizQuestion = () => {
    setQuizAssignmentData({
      ...quizAssignmentData,
      quizQuestions: [...quizAssignmentData.quizQuestions, { question: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const removeQuizQuestion = (index) => {
    const updated = quizAssignmentData.quizQuestions.filter((_, i) => i !== index);
    setQuizAssignmentData({ ...quizAssignmentData, quizQuestions: updated });
  };

  const handleSubmit = async () => {
    if (!courseId) {
      alert('Please select a course');
      return;
    }
  
    try {
      if (assignmentType === 'file') {
        await editFileAssignment({ assignmentId: id, courseId, data: fileAssignmentData }).unwrap();
        alert('File assignment updated successfully!');
      } else {
        // Format quizQuestions to match schema
        const formattedQuestions = quizAssignmentData.quizQuestions.map((q) => ({
          question: q.question,
          options: q.options.map((opt) => ({
            optionText: opt,
            isCorrect: q.correctAnswer === opt,
          })),
          correctAnswer: q.correctAnswer,
        }));
  
        const payload = {
          ...quizAssignmentData,
          quizQuestions: formattedQuestions,
        };
  
        await editQuizAssignment({ assignmentId: id, courseId, data: payload }).unwrap();
        alert('Quiz assignment updated successfully!');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating assignment');
    }
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto bg-background text-foreground space-y-6">
      <h1 className="text-2xl font-bold">Edit Assignment</h1>

      {/* Course Selection */}
      <div className="space-y-1">
        <Label>Select Course:</Label>
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading courses</p>
        ) : (
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Course" />
            </SelectTrigger>
            <SelectContent>
              {courses?.courses?.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.courseTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Assignment Type */}
      <div className="space-y-1">
        <Label>Assignment Type:</Label>
        <Select value={assignmentType} onValueChange={setAssignmentType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="file">File Assignment</SelectItem>
            <SelectItem value="quiz">Quiz Assignment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      {assignmentType === 'file' ? (
        <div className="space-y-1">
          <Label>Title:</Label>
          <Input
            type="text"
            value={fileAssignmentData.title}
            onChange={(e) => setFileAssignmentData({ ...fileAssignmentData, title: e.target.value })}
          />
        </div>
      ) : (
        <div className="space-y-1">
          <Label>Title:</Label>
          <Input
            type="text"
            value={quizAssignmentData.title}
            onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, title: e.target.value })}
          />
        </div>
      )}

      {/* File Assignment */}
      {assignmentType === 'file' && (
        <div className="space-y-4">
          <Label>Difficulty:</Label>
          <Select value={fileAssignmentData.difficulty} onValueChange={(value) => setFileAssignmentData({ ...fileAssignmentData, difficulty: value })}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Label>Detailed Instructions:</Label>
          <ReactQuill value={fileAssignmentData.detailedInstruction} onChange={(val) => setFileAssignmentData({ ...fileAssignmentData, detailedInstruction: val })} />

          <Label>Deadline:</Label>
          <Input
            type="datetime-local"
            value={fileAssignmentData.deadline}
            onChange={(e) => setFileAssignmentData({ ...fileAssignmentData, deadline: e.target.value })}
          />

          <Label>Grading Criteria:</Label>
          <Textarea
            value={fileAssignmentData.gradingCriteria}
            onChange={(e) => setFileAssignmentData({ ...fileAssignmentData, gradingCriteria: e.target.value })}
          />


        </div>
      )}

      {/* Quiz Assignment */}
      {assignmentType === 'quiz' && (
        <div className="space-y-4">
          <Label>Difficulty:</Label>
          <Select value={quizAssignmentData.difficulty} onValueChange={(value) => setQuizAssignmentData({ ...quizAssignmentData, difficulty: value })}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Label>Detailed Instructions:</Label>
          <ReactQuill value={quizAssignmentData.detailedInstruction} onChange={(val) => setQuizAssignmentData({ ...quizAssignmentData, detailedInstruction: val })} />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Deadline:</Label>
              <Input
                type="datetime-local"
                value={quizAssignmentData.deadline}
                onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, deadline: e.target.value })}
              />
            </div>
            <div>
              <Label>Duration (minutes):</Label>
              <Input
                type="number"
                value={quizAssignmentData.duration}
                onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, duration: +e.target.value })}
              />
            </div>
            <div>
              <Label>Passing Marks:</Label>
              <Input
                type="number"
                value={quizAssignmentData.passingMarks}
                onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, passingMarks: +e.target.value })}
              />
            </div>
          </div>

          <Label>Max Attempts:</Label>
          <Input
            type="number"
            value={quizAssignmentData.maxAttempts}
            onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, maxAttempts: +e.target.value })}
          />

          <h3 className="text-lg font-semibold">Questions</h3>
          {quizAssignmentData?.quizQuestions?.map((question, index) => (
            <div key={index} className="border p-4 rounded-md space-y-3 bg-muted">
              <Label>Question {index + 1}:</Label>
              <Input
                type="text"
                value={question.question}
                onChange={(e) => handleQuizQuestionChange(index, 'question', e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <div key={i}>
                    <Label>Option {i + 1}:</Label>
                    <Input
                      type="text"
                      value={opt.optionText}
                      onChange={(e) => handleQuizOptionChange(index, i, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <Label>Correct Answer:</Label>
              <Input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => handleQuizQuestionChange(index, 'correctAnswer', e.target.value)}
              />

              <Button variant="destructive" onClick={() => removeQuizQuestion(index)} disabled={quizAssignmentData.quizQuestions.length === 1}>
                Remove Question
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addQuizQuestion}>+ Add Question</Button>
        </div>
      )}

      <Button className="w-full mt-6" onClick={handleSubmit}>Submit Assignment</Button>
    </div>
  );
};

export default EditAssignmentPage;
