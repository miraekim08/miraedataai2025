"use client";

import { Upload, FileText, File, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { CreateTestDialog } from "@/components/shared/create-test-dialog";
import { useState, useCallback } from "react";
import type { StudyMaterial } from "@/types";

export default function MaterialsPage() {
    const { materials, addMaterial, removeMaterial, currentTestPrep } = useStore();
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        files.forEach((file) => {
            const newMaterial: StudyMaterial = {
                id: `material-${Date.now()}-${Math.random()}`,
                testPrepId: currentTestPrep?.id || "test-1",
                fileName: file.name,
                fileType: file.name.endsWith('.pdf') ? 'pdf' :
                    file.name.endsWith('.docx') ? 'docx' : 'txt',
                fileSize: file.size,
                uploadedAt: new Date(),
                fileUrl: URL.createObjectURL(file),
                materialType: 'other',
                processingStatus: 'completed',
                extractedMetadata: {
                    estimatedReadingMinutes: Math.ceil(file.size / 10000),
                },
            };
            addMaterial(newMaterial);
        });
    }, [addMaterial, currentTestPrep]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
            const newMaterial: StudyMaterial = {
                id: `material-${Date.now()}-${Math.random()}`,
                testPrepId: currentTestPrep?.id || "test-1",
                fileName: file.name,
                fileType: file.name.endsWith('.pdf') ? 'pdf' :
                    file.name.endsWith('.docx') ? 'docx' : 'txt',
                fileSize: file.size,
                uploadedAt: new Date(),
                fileUrl: URL.createObjectURL(file),
                materialType: 'other',
                processingStatus: 'completed',
                extractedMetadata: {
                    estimatedReadingMinutes: Math.ceil(file.size / 10000),
                },
            };
            addMaterial(newMaterial);
        });
    }, [addMaterial, currentTestPrep]);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-6">
            {/* Header with action */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
                    <p className="text-muted-foreground mt-1">
                        Upload your study materials and create a test preparation plan
                    </p>
                </div>
                <CreateTestDialog />
            </div>

            {/* Upload Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload Materials</CardTitle>
                    <CardDescription>
                        Drag and drop your study materials or click to browse
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                    >
                        <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                        <p className="text-lg font-medium mb-2">
                            Drop files here or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Supports PDF, DOCX, TXT (Max 50MB per file)
                        </p>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileInput}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload">
                            <Button asChild>
                                <span>Choose Files</span>
                            </Button>
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Materials List */}
            <Card>
                <CardHeader>
                    <CardTitle>Uploaded Materials ({materials.length})</CardTitle>
                    <CardDescription>
                        {materials.length === 0
                            ? "No materials uploaded yet"
                            : "Manage your study materials"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {materials.length > 0 ? (
                        <div className="space-y-2">
                            {materials.map((material) => (
                                <div
                                    key={material.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {material.fileType === 'pdf' ? (
                                            <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                                        ) : (
                                            <File className="h-8 w-8 text-blue-500 flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{material.fileName}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                <span className="capitalize">{material.materialType}</span>
                                                <span>{formatFileSize(material.fileSize)}</span>
                                                {material.extractedMetadata.estimatedReadingMinutes && (
                                                    <span>~{material.extractedMetadata.estimatedReadingMinutes} min read</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeMaterial(material.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Upload className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-medium mb-1">No materials yet</p>
                            <p className="text-sm">Upload your first study material to get started</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
