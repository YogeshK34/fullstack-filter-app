'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<Omit<Student, 'id' | 'created_at'>>({
    name: '',
    email: '',
    branch: '',
    building: '',
    floor: 0,
    room_number: '',
    year: 1,
    gender: '',
  });

  // Fetch students
  const fetchStudents = () => {
    fetch('http://localhost:8080/')
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error('Failed to fetch:', err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Create new student
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Student created!');
      setForm({
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
    } else {
      alert('Failed to create student');
    }
  };

  // Delete a student
  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:8080/delete/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Deleted');
      fetchStudents();
    } else {
      alert('Delete failed');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editing) return;

  const { id, created_at, ...dataToUpdate } = editing;

  const res = await fetch(`http://localhost:8080/updateuser/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToUpdate),
  });

  if (res.ok) {
    alert('Student updated!');
    setEditing(null);
    fetchStudents();
  } else {
    alert('Update failed');
  }
};


  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'floor' || name === 'year' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Students</h1>

      {/* Create Student Form */}
      <form onSubmit={handleCreate} className="space-y-2 mb-6">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="block border p-1 w-full" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="block border p-1 w-full" />
        <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} className="block border p-1 w-full" />
        <input name="building" placeholder="Building" value={form.building} onChange={handleChange} className="block border p-1 w-full" />
        <input name="floor" type="number" placeholder="Floor" value={form.floor} onChange={handleChange} className="block border p-1 w-full" />
        <input name="room_number" placeholder="Room Number" value={form.room_number} onChange={handleChange} className="block border p-1 w-full" />
        <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} className="block border p-1 w-full" />
        <select name="gender" value={form.gender} onChange={handleChange} className="block border p-1 w-full">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Student
        </button>
      </form>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
  <DialogContent>
    <form onSubmit={handleUpdate} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edit Student</DialogTitle>
      </DialogHeader>

      {editing && (
        <>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Branch</Label>
            <Input value={editing.branch} onChange={(e) => setEditing({ ...editing, branch: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Building</Label>
            <Input value={editing.building} onChange={(e) => setEditing({ ...editing, building: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Floor</Label>
            <Input
              type="number"
              value={editing.floor}
              onChange={(e) => setEditing({ ...editing, floor: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Room Number</Label>
            <Input value={editing.room_number} onChange={(e) => setEditing({ ...editing, room_number: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              value={editing.year}
              onChange={(e) => setEditing({ ...editing, year: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Input value={editing.gender} onChange={(e) => setEditing({ ...editing, gender: e.target.value })} />
          </div>
        </>
      )}

      <DialogFooter>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>


      {/* Students Table */}
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Branch</th>
            <th className="border px-2 py-1">Building</th>
            <th className="border px-2 py-1">Floor</th>
            <th className="border px-2 py-1">Room</th>
            <th className="border px-2 py-1">Year</th>
            <th className="border px-2 py-1">Gender</th>
            <th className="border px-2 py-1">Created</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.email}</td>
              <td className="border px-2 py-1">{s.branch}</td>
              <td className="border px-2 py-1">{s.building}</td>
              <td className="border px-2 py-1">{s.floor}</td>
              <td className="border px-2 py-1">{s.room_number}</td>
              <td className="border px-2 py-1">{s.year}</td>
              <td className="border px-2 py-1">{s.gender}</td>
              <td className="border px-2 py-1">{new Date(s.created_at).toLocaleString()}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
