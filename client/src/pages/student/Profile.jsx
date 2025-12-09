// src/pages/student/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";

/**
 * Profile page — visual redesign + small UX improvements
 * - keeps the same API hooks and update flow
 * - shows preview for selected profile photo
 * - prevents saving when there are no changes
 */

const Profile = () => {
  const navigate = useNavigate();

  // load current user
  const { data, isLoading, isError, refetch } = useLoadUserQuery();
  const user = data?.user || null;

  const [name, setName] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");

  const [
    updateUser,
    { data: updateUserData, error: updateError, isLoading: updateUserIsLoading, isSuccess, isError: updateIsError },
  ] = useUpdateUserMutation();

  // initialize form values when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPreviewSrc(user.photoUrl || "");
      setProfilePhotoFile(null); // clear local selection
    }
  }, [user]);

  // create a preview when a local file is chosen
  useEffect(() => {
    if (!profilePhotoFile) return;
    const url = URL.createObjectURL(profilePhotoFile);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhotoFile]);

  // refetch user after successful update and show toast
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated");
      // clear local file selection (keeps name if you changed)
      setProfilePhotoFile(null);
    }
    if (updateIsError) {
      // prefer structured error messages if available
      const msg = updateError?.data?.message || updateError?.message || "Failed to update profile";
      toast.error(msg);
    }
  }, [isSuccess, updateIsError]);

  // handle file input change
  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
    }
  };

  const updateUserHandler = async () => {
    // avoid sending empty updates
    if (!name && !profilePhotoFile) {
      toast.error("No changes to save");
      return;
    }

    try {
      const formData = new FormData();
      if (name && name !== user?.name) formData.append("name", name);
      if (profilePhotoFile) formData.append("profilePhoto", profilePhotoFile);
      await updateUser(formData).unwrap();
      // success handled by useEffect
    } catch (err) {
      // error toast handled by useEffect
      console.error(err);
    }
  };

  // whether Save should be enabled
  const hasChanges = useMemo(() => {
    if (!user) return false;
    const nameChanged = name && name !== user.name;
    const photoChanged = Boolean(profilePhotoFile);
    return nameChanged || photoChanged;
  }, [name, profilePhotoFile, user]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 my-10">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
          <div className="h-40 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 my-10 text-center">
        <p className="text-red-500">Failed to load profile.</p>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Profile card */}
        <div className="w-full md:w-1/3 flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <Avatar className="h-28 w-28 md:h-32 md:w-32 mb-4">
            {previewSrc ? (
              <AvatarImage src={previewSrc} alt={user?.name || "avatar"} />
            ) : (
              <AvatarFallback>{(user?.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>

          <div className="text-center">
            <div className="font-semibold text-lg text-slate-900 dark:text-white">{user?.name || "—"}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user?.email || "—"}</div>
            <div className="text-xs text-slate-400 mt-1">{(user?.role || "user").toUpperCase()}</div>
          </div>

          <div className="mt-4 w-full">
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Update your name and profile photo.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="col-span-1">Name</Label>
                      <Input
                        className="col-span-3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="col-span-1">Photo</Label>
                      <div className="col-span-3 flex items-center gap-3">
                        <Input type="file" accept="image/*" onChange={onChangeHandler} />
                        {previewSrc && (
                          <img
                            src={previewSrc}
                            alt="preview"
                            className="h-10 w-10 rounded object-cover border"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <div className="w-full flex items-center justify-between gap-3">
                      <Button variant="ghost" onClick={() => { setName(user?.name || ""); setProfilePhotoFile(null); setPreviewSrc(user?.photoUrl || ""); }}>
                        Cancel
                      </Button>

                      <Button disabled={!hasChanges || updateUserIsLoading} onClick={updateUserHandler}>
                        {updateUserIsLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" onClick={() => navigate("/courses")}>Browse Courses</Button>
            </div>
          </div>
        </div>

        {/* Right column: details + enrolled courses */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Profile details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500">Name</div>
                <div className="mt-1 font-medium">{user?.name || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="mt-1 font-medium">{user?.email || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Role</div>
                <div className="mt-1 font-medium">{(user?.role || "user").toUpperCase()}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Enrolled courses</div>
                <div className="mt-1 font-medium">{(user?.enrolledCourses?.length) ?? 0}</div>
              </div>
            </div>
          </div>

          {/* Enrolled courses */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Courses you’re enrolled in</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/courses")}>Explore more</Button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(user?.enrolledCourses) && user.enrolledCourses.length > 0 ? (
                user.enrolledCourses.map((c) => <Course key={c._id} course={c} />)
              ) : (
                <div className="col-span-full p-6 text-center text-slate-500 bg-white dark:bg-slate-900 rounded">
                  You haven't enrolled in any courses yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
