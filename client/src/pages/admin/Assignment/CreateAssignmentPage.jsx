import React, { useState, useEffect } from 'react';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi';
import { useCreateFileAssignmentMutation } from '@/features/api/fileAssignmentApi';
import { useCreateQuizAssignmentMutation } from '@/features/api/quizAssignmentApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';

const CreateAssignmentPage = () => {
  const [assignmentType, setAssignmentType] = useState('file');
  const [courseId, setCourseId] = useState('');
  const user = useSelector((state)=> state.auth)
  

  const [fileAssignmentData, setFileAssignmentData] = useState({
    difficulty: 'easy',
    title:'',
    detailedInstruction: '',
    deadline: '',
    gradingCriteria: '',
    
  });

  const [quizAssignmentData, setQuizAssignmentData] = useState({
    difficulty: 'easy',
    title:"",
    detailedInstruction: '',
    deadline: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
    duration: 30,
    passingMarks: 50,
    maxAttempts: 1,
  });

  const { data: courses, isLoading, isError } = useGetCreatorCourseQuery();
  const [createFileAssignment] = useCreateFileAssignmentMutation();
  const [createQuizAssignment] = useCreateQuizAssignmentMutation();
  

  const handleQuizQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizAssignmentData.questions];
    updatedQuestions[index][field] = value;
    setQuizAssignmentData({ ...quizAssignmentData, questions: updatedQuestions });
  };

  const handleQuizOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...quizAssignmentData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuizAssignmentData({ ...quizAssignmentData, questions: updatedQuestions });
  };

  const addQuizQuestion = () => {
    setQuizAssignmentData({
      ...quizAssignmentData,
      questions: [...quizAssignmentData.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const removeQuizQuestion = (index) => {
    const updated = quizAssignmentData.questions.filter((_, i) => i !== index);
    setQuizAssignmentData({ ...quizAssignmentData, questions: updated });
  };

  const handleSubmit = async () => {
    if (!courseId) {
      alert('Please select a course');
      return;
    }
  
    try {
      if (assignmentType === 'file') {
        // File assignment submission logic
        await createFileAssignment({ courseId, data: fileAssignmentData });
        alert('File assignment created successfully!');
      } else {
        // Format quizQuestions to match the database schema
        const formattedQuestions = quizAssignmentData.questions.map((q) => ({
          question: q.question,
          options: q.options.map((opt) => ({
            optionText: opt,
            isCorrect: q.correctAnswer === opt, // mark option as correct based on the user's input
          })),
          correctAnswer: q.correctAnswer, // Store correct answer for later validation
        }));
  
        const payload = {
          course: courseId,
          createdBy: 'user._id', // You'll need to replace 'USER_ID' with the actual user ID (probably from authentication)
          difficulty: quizAssignmentData.difficulty,
          title: quizAssignmentData.title,
          detailedInstruction: quizAssignmentData.detailedInstruction,
          quizQuestions: formattedQuestions,
          duration: quizAssignmentData.duration,
          passingMarks: quizAssignmentData.passingMarks,
          maxAttempts: quizAssignmentData.maxAttempts,
          isTimed: true, // Or dynamically set based on user input
          isActive: true, // Or dynamically set based on your requirements
        };
  
        // Submit the quiz assignment
        await createQuizAssignment({ courseId, data: payload });
        alert('Quiz assignment created successfully!');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment');
    }
  };
  

  return (
    <div className="p-6 max-w-5xl mx-auto bg-background text-foreground space-y-6">
      <h1 className="text-2xl font-bold">Create Assignment</h1>

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
      {assignmentType==='file' ?(
          <div className='space-y-1'>
           <Label>Title:</Label>
           <Input type="text" value={fileAssignmentData.title} onChange={(e) => setFileAssignmentData({ ...fileAssignmentData, title: e.target.value })} />
         </div>
        ):(
          <div className='space-y-1'>
          <Label>Title:</Label>
          <Input type="text" value={quizAssignmentData.title} onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, title: e.target.value })} />
        </div>
        )
        }
     

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
          <Input type="datetime-local" value={fileAssignmentData.deadline} onChange={(e) => setFileAssignmentData({ ...fileAssignmentData, deadline: e.target.value })} />

          <Label>Grading Criteria:</Label>
          <Textarea value={fileAssignmentData.gradingCriteria} onChange={(e) => setFileAssignmentData({ ...fileAssignmentData, gradingCriteria: e.target.value })} />

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
              <Input type="datetime-local" value={quizAssignmentData.deadline} onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, deadline: e.target.value })} />
            </div>
            <div>
              <Label>Duration (minutes):</Label>
              <Input type="number" value={quizAssignmentData.duration} onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, duration: +e.target.value })} />
            </div>
            <div>
              <Label>Passing Marks:</Label>
              <Input type="number" value={quizAssignmentData.passingMarks} onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, passingMarks: +e.target.value })} />
            </div>
          </div>

          <Label>Max Attempts:</Label>
          <Input type="number" value={quizAssignmentData.maxAttempts} onChange={(e) => setQuizAssignmentData({ ...quizAssignmentData, maxAttempts: +e.target.value })} />

          <h3 className="text-lg font-semibold">Questions</h3>
          {quizAssignmentData.questions.map((question, index) => (
            <div key={index} className="border p-4 rounded-md space-y-3 bg-muted">
              <Label>Question {index + 1}:</Label>
              <Input type="text" value={question.question} onChange={(e) => handleQuizQuestionChange(index, 'question', e.target.value)} />

              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <div key={i}>
                    <Label>Option {i + 1}:</Label>
                    <Input type="text" value={opt} onChange={(e) => handleQuizOptionChange(index, i, e.target.value)} />
                  </div>
                ))}
              </div>

              <Label>Correct Answer:</Label>
              <Input type="text" value={question.correctAnswer} onChange={(e) => handleQuizQuestionChange(index, 'correctAnswer', e.target.value)} />

              <Button variant="destructive" onClick={() => removeQuizQuestion(index)} disabled={quizAssignmentData.questions.length === 1}>
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

export default CreateAssignmentPage;
