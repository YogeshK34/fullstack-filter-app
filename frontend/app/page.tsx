'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Student = {
  id: number;
  name: string;
  email: string;
  branch: string;
  building: string;
  floor: number;
  room_number: string;
  year: number;
  gender: string;
  created_at: string;
};

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id' | 'created_at'>>({
    name: '',
    email: '',
    branch: '',
    building: '',
    floor: 0,
    room_number: '',
    year: 1,
    gender: '',
  });
  const [editing, setEditing] = useState<Student | null>(null);

  const [searchName, setSearchName] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const fetchStudents = async () => {
    const res = await fetch('http://localhost:8080/');
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreate = async () => {
    const res = await fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });

    if (res.ok) {
      setNewStudent({
        name: '',
        email: '',
        branch: '',
        building: '',
        floor: 0,
        room_number: '',
        year: 1,
        gender: '',
      });
      fetchStudents();
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8080/deleteuser/${id}`, {
      method: 'DELETE',
    });
    fetchStudents();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const { id, created_at, ...updateData } = editing;

    const res = await fetch(`http://localhost:8080/updateuser/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      setEditing(null);
      fetchStudents();
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesBranch = filterBranch ? student.branch === filterBranch : true;
    const matchesYear = filterYear ? student.year.toString() === filterYear : true;
    return matchesName && matchesBranch && matchesYear;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      {/* Create Form */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Create Student</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
          <Input placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
          <Input placeholder="Branch" value={newStudent.branch} onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })} />
          <Input placeholder="Building" value={newStudent.building} onChange={(e) => setNewStudent({ ...newStudent, building: e.target.value })} />
          <Input placeholder="Floor" type="number" value={newStudent.floor} onChange={(e) => setNewStudent({ ...newStudent, floor: parseInt(e.target.value) })} />
          <Input placeholder="Room #" value={newStudent.room_number} onChange={(e) => setNewStudent({ ...newStudent, room_number: e.target.value })} />
          <Input placeholder="Year" type="number" value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: parseInt(e.target.value) })} />
          <Input placeholder="Gender" value={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })} />
        </div>
        <Button onClick={handleCreate}>Create</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-1 flex-1">
          <Label>Name</Label>
          <Input placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
        <div className="space-y-1 flex-1">
          <Label>Branch</Label>
          <select className="w-full border px-2 py-1 rounded" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
            <option value="">All</option>
            <option value="Msc DataScience">Msc DataScience</option>
            <option value="Msc Blockchain">Msc Blockchain</option>
            <option value="MCA">MCA</option>
          </select>
        </div>
        <div className="space-y-1 flex-1">
          <Label>Year</Label>
          <select className="w-full border px-2 py-1 rounded" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Branch</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.email}</td>
              <td className="p-2 border">{s.branch}</td>
              <td className="p-2 border space-x-2">
                <Button variant="outline" onClick={() => setEditing(s)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>

            {editing && (
              <>
                <Input placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                <Input placeholder="Email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                <Input placeholder="Branch" value={editing.branch} onChange={(e) => setEditing({ ...editing, branch: e.target.value })} />
                <Input placeholder="Building" value={editing.building} onChange={(e) => setEditing({ ...editing, building: e.target.value })} />
                <Input placeholder="Floor" type="number" value={editing.floor} onChange={(e) => setEditing({ ...editing, floor: parseInt(e.target.value) })} />
                <Input placeholder="Room #" value={editing.room_number} onChange={(e) => setEditing({ ...editing, room_number: e.target.value })} />
                <Input placeholder="Year" type="number" value={editing.year} onChange={(e) => setEditing({ ...editing, year: parseInt(e.target.value) })} />
                <Input placeholder="Gender" value={editing.gender} onChange={(e) => setEditing({ ...editing, gender: e.target.value })} />
              </>
            )}

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
