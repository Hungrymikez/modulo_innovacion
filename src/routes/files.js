const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const supabase = require('../db');
const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, unique + ext);
  },
});
const upload = multer({ storage });

// router.get('/', async (req, res) => {
//   try {
//     const { q, projectId, dateFrom, dateTo, sgpsCode, studyCenter, regional, showModified } = req.query;
    
//     // Determine which table to query
//     const tableName = showModified === 'true' ? 'modified_files' : 'files';
    
//     let query = supabase
//       .from(tableName)
//       .select(`
//         id,
//         project_id,
//         file_name,
//         upload_date,
//         report_date,
//         responsible,
//         progress,
//         observations,
//         file_size,
//         version,
//         category,
//         storage_path,
//         sgps_code,
//         study_center_name,
//         regional,
//         project_responsibles,
//         ${showModified === 'true' ? 'original_file_id, modification_reason' : ''}
//         projects!inner(id, name)
//       `)
//       .order('upload_date', { ascending: false });

//     // Apply filters
//     if (q) {
//       query = query.or(`file_name.ilike.%${q}%,responsible.ilike.%${q}%,observations.ilike.%${q}%,category.ilike.%${q}%,sgps_code.ilike.%${q}%,study_center_name.ilike.%${q}%,regional.ilike.%${q}%`);
//     }
//     if (projectId) {
//       query = query.eq('project_id', projectId);
//     }
//     if (dateFrom) {
//       query = query.gte('report_date', dateFrom);
//     }
//     if (dateTo) {
//       query = query.lte('report_date', dateTo);
//     }
//     if (sgpsCode) {
//       query = query.ilike('sgps_code', `%${sgpsCode}%`);
//     }
//     if (studyCenter) {
//       query = query.ilike('study_center_name', `%${studyCenter}%`);
//     }
//     if (regional) {
//       query = query.ilike('regional', `%${regional}%`);
//     }

//     const { data, error } = await query;
    
//     if (error) {
//       throw error;
//     }

//     // Transform data to match expected format
//     const transformedData = data.map(row => ({
//       id: row.id,
//       projectId: row.project_id,
//       projectName: row.projects.name,
//       fileName: row.file_name,
//       uploadDate: row.upload_date,
//       reportDate: row.report_date,
//       responsible: row.responsible,
//       progress: row.progress,
//       observations: row.observations,
//       fileSize: row.file_size,
//       version: row.version,
//       category: row.category,
//       storagePath: row.storage_path,
//       sgpsCode: row.sgps_code,
//       studyCenterName: row.study_center_name,
//       regional: row.regional,
//       projectResponsibles: row.project_responsibles,
//       ...(showModified === 'true' && {
//         originalFileId: row.original_file_id,
//         modificationReason: row.modification_reason
//       })
//     }));

//     res.json(transformedData);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get('/debug', async (req, res) => {
  try {
    // Test 1: Consulta simple sin JOIN
    console.log('Test 1: Consulta simple a files');
    const { data: simpleData, error: simpleError } = await supabase
      .from('files')
      .select('id, file_name')
      .limit(5);
    
    console.log('Simple query result:', { data: simpleData, error: simpleError });

    // Test 2: Consulta con JOIN
    console.log('Test 2: Consulta con JOIN');
    const { data: joinData, error: joinError } = await supabase
      .from('files')
      .select('id, file_name, projects(name)')
      .limit(5);

    console.log('Join query result:', { data: joinData, error: joinError });

    res.json({
      simpleQuery: { data: simpleData, error: simpleError },
      joinQuery: { data: joinData, error: joinError }
    });
  } catch (err) {
    console.error('Error en debug:', err);
    res.status(500).json({ error: err.message });
  }
});

// En tu router, agrega:
router.get('/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*').limit(5);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Conexión exitosa a Supabase',
      data: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error de conexión a Supabase',
      error: err.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { q, projectId, dateFrom, dateTo, sgpsCode, studyCenter, regional, showModified } = req.query;
    
    // Determine which table to query
    const tableName = showModified === 'true' ? 'modified_files' : 'files';
    
    // QUITA EL JOIN TEMPORALMENTE para probar
    let query = supabase
      .from(tableName)
      .select('*') // ← Cambia a select simple
      .order('upload_date', { ascending: false });

    // Apply filters
    if (q) {
      query = query.or(`file_name.ilike.%${q}%,responsible.ilike.%${q}%,observations.ilike.%${q}%,category.ilike.%${q}%,sgps_code.ilike.%${q}%,study_center_name.ilike.%${q}%,regional.ilike.%${q}%`);
    }
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (dateFrom) {
      query = query.gte('report_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('report_date', dateTo);
    }
    if (sgpsCode) {
      query = query.ilike('sgps_code', `%${sgpsCode}%`);
    }
    if (studyCenter) {
      query = query.ilike('study_center_name', `%${studyCenter}%`);
    }
    if (regional) {
      query = query.ilike('regional', `%${regional}%`);
    }

    console.log(`Consultando tabla: ${tableName}`);
    const { data, error } = await query;
    
    if (error) {
      console.error('Error en consulta:', error);
      throw error;
    }

    console.log(`Datos obtenidos: ${data ? data.length : 0} registros`);
    
    // Obtener nombres de proyectos por separado
    const projectIds = [...new Set(data.map(row => row.project_id))];
    let projectsMap = {};
    
    if (projectIds.length > 0) {
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name')
        .in('id', projectIds);
      
      if (!projectsError && projects) {
        projectsMap = projects.reduce((acc, project) => {
          acc[project.id] = project.name;
          return acc;
        }, {});
      }
    }

    // Transform data
    const transformedData = data.map(row => ({
      id: row.id,
      projectId: row.project_id,
      projectName: projectsMap[row.project_id] || 'Proyecto no encontrado',
      fileName: row.file_name,
      uploadDate: row.upload_date,
      reportDate: row.report_date,
      responsible: row.responsible,
      progress: row.progress,
      observations: row.observations,
      fileSize: row.file_size,
      version: row.version,
      category: row.category,
      storagePath: row.storage_path,
      sgpsCode: row.sgps_code,
      studyCenterName: row.study_center_name,
      regional: row.regional,
      projectResponsibles: row.project_responsibles,
      ...(showModified === 'true' && {
        originalFileId: row.original_file_id,
        modificationReason: row.modification_reason
      })
    }));

    res.json(transformedData);
  } catch (err) {
    console.error('Error completo en endpoint /files:', err);
    res.status(500).json({ error: err.message });
  }
});

// Devuelve SOLO las versiones modificadas de un archivo original específico
router.get('/versions/:originalFileId', async (req, res) => {
  try {
    const { originalFileId } = req.params;
    const { q, projectId, dateFrom, dateTo, sgpsCode, studyCenter, regional } = req.query;
    
    let query = supabase
      .from('modified_files')
      .select(`
        id,
        project_id,
        file_name,
        upload_date,
        report_date,
        responsible,
        progress,
        observations,
        file_size,
        version,
        category,
        storage_path,
        sgps_code,
        study_center_name,
        regional,
        project_responsibles,
        original_file_id,
        modification_reason,
        projects!inner(id, name)
      `)
      .eq('original_file_id', originalFileId)
      .order('upload_date', { ascending: false });

    // Apply filters
    if (q) {
      query = query.or(`file_name.ilike.%${q}%,responsible.ilike.%${q}%,observations.ilike.%${q}%,category.ilike.%${q}%,sgps_code.ilike.%${q}%,study_center_name.ilike.%${q}%,regional.ilike.%${q}%`);
    }
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (dateFrom) {
      query = query.gte('report_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('report_date', dateTo);
    }
    if (sgpsCode) {
      query = query.ilike('sgps_code', `%${sgpsCode}%`);
    }
    if (studyCenter) {
      query = query.ilike('study_center_name', `%${studyCenter}%`);
    }
    if (regional) {
      query = query.ilike('regional', `%${regional}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      throw error;
    }

    // Transform data to match expected format
    const transformedData = data.map(row => ({
      id: row.id,
      projectId: row.project_id,
      projectName: row.projects.name,
      fileName: row.file_name,
      uploadDate: row.upload_date,
      reportDate: row.report_date,
      responsible: row.responsible,
      progress: row.progress,
      observations: row.observations,
      fileSize: row.file_size,
      version: row.version,
      category: row.category,
      storagePath: row.storage_path,
      sgpsCode: row.sgps_code,
      studyCenterName: row.study_center_name,
      regional: row.regional,
      projectResponsibles: row.project_responsibles,
      originalFileId: row.original_file_id,
      modificationReason: row.modification_reason
    }));

    res.json(transformedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Metadatos del archivo original (para prellenar el modal de actualizar)
router.get('/meta/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select(`
        id,
        project_id,
        file_name,
        upload_date,
        report_date,
        responsible,
        progress,
        observations,
        file_size,
        version,
        category,
        sgps_code,
        study_center_name,
        regional,
        project_responsibles
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No encontrado' });
      }
      throw error;
    }

    // Transform data to match expected format
    const transformedData = {
      id: data.id,
      projectId: data.project_id,
      fileName: data.file_name,
      uploadDate: data.upload_date,
      reportDate: data.report_date,
      responsible: data.responsible,
      progress: data.progress,
      observations: data.observations,
      fileSize: data.file_size,
      version: data.version,
      category: data.category,
      sgpsCode: data.sgps_code,
      studyCenterName: data.study_center_name,
      regional: data.regional,
      projectResponsibles: data.project_responsibles
    };

    res.json(transformedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');

    if (error) {
      throw error;
    }
    console.log("Proyectos desde Supabase:", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener archivos actuales (última versión de cada proyecto)
router.get('/current', async (req, res) => {
  try {
    const { dateFrom, dateTo, limit = 20 } = req.query;
    
    // Get original files
    let originalQuery = supabase
      .from('files')
      .select(`
        id,
        project_id,
        file_name,
        upload_date,
        report_date,
        responsible,
        progress,
        observations,
        file_size,
        version,
        category,
        sgps_code,
        study_center_name,
        regional,
        project_responsibles,
        projects!inner(id, name)
      `)
      .order('upload_date', { ascending: false });

    // Get modified files
    let modifiedQuery = supabase
      .from('modified_files')
      .select(`
        id,
        project_id,
        file_name,
        upload_date,
        report_date,
        responsible,
        progress,
        observations,
        file_size,
        version,
        category,
        sgps_code,
        study_center_name,
        regional,
        project_responsibles,
        original_file_id,
        modification_reason,
        projects!inner(id, name)
      `)
      .order('upload_date', { ascending: false });

    // Apply date filters if provided
    if (dateFrom) {
      originalQuery = originalQuery.gte('upload_date', dateFrom);
      modifiedQuery = modifiedQuery.gte('upload_date', dateFrom);
    }
    if (dateTo) {
      originalQuery = originalQuery.lte('upload_date', dateTo);
      modifiedQuery = modifiedQuery.lte('upload_date', dateTo);
    }

    // Execute both queries
    const [originalResult, modifiedResult] = await Promise.all([
      originalQuery,
      modifiedQuery
    ]);

    if (originalResult.error) throw originalResult.error;
    if (modifiedResult.error) throw modifiedResult.error;

    // Transform original files
    const originalFiles = originalResult.data.map(row => ({
      id: row.id,
      projectId: row.project_id,
      projectName: row.projects.name,
      fileName: row.file_name,
      uploadDate: row.upload_date,
      reportDate: row.report_date,
      responsible: row.responsible,
      progress: row.progress,
      observations: row.observations,
      fileSize: row.file_size,
      version: row.version,
      category: row.category,
      sgpsCode: row.sgps_code,
      studyCenterName: row.study_center_name,
      regional: row.regional,
      projectResponsibles: row.project_responsibles,
      fileType: 'original',
      originalFileId: null,
      modificationReason: null
    }));

    // Transform modified files
    const modifiedFiles = modifiedResult.data.map(row => ({
      id: row.id,
      projectId: row.project_id,
      projectName: row.projects.name,
      fileName: row.file_name,
      uploadDate: row.upload_date,
      reportDate: row.report_date,
      responsible: row.responsible,
      progress: row.progress,
      observations: row.observations,
      fileSize: row.file_size,
      version: row.version,
      category: row.category,
      sgpsCode: row.sgps_code,
      studyCenterName: row.study_center_name,
      regional: row.regional,
      projectResponsibles: row.project_responsibles,
      fileType: 'modified',
      originalFileId: row.original_file_id,
      modificationReason: row.modification_reason
    }));

    // Combine and sort by upload date
    const allFiles = [...originalFiles, ...modifiedFiles]
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .slice(0, parseInt(limit));
    
    res.json(allFiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para eliminar archivos
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isModified } = req.query;
    
    let tableName = 'files';
    if (isModified === 'true') {
      tableName = 'modified_files';
    }
    
    // Obtener información del archivo antes de eliminar
    const { data: fileInfo, error: fetchError } = await supabase
      .from(tableName)
      .select('storage_path')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
      throw fetchError;
      return;
    }
    
    // Eliminar de la base de datos
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Eliminar archivo físico
    const filePath = path.join(uploadsDir, fileInfo.storage_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: 'Archivo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { projectId, reportDate, responsible, progress, observations, sgpsCode, studyCenterName, regional, projectResponsibles, isModification, originalFileId, modificationReason } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Archivo requerido' });

    const fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';
    
    // Verify project exists
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .single();
    
    if (projectError || !projectData) {
      return res.status(400).json({ error: 'Proyecto inválido' });
    }

    const category = (projectData.name.split(' - ')[1] || 'General');

    // Generate unique filename with date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const originalName = req.file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const uniqueFileName = `${baseName}_${dateStr}_${timeStr}${ext}`;

    // Calculate next version for this project (considering both original and modified files)
    const { data: versionData, error: versionError } = await supabase
      .from('files')
      .select('version, upload_date')
      .eq('project_id', projectId)
      .order('upload_date', { ascending: false })
      .limit(1);
    
    const { data: modifiedVersionData, error: modifiedVersionError } = await supabase
      .from('modified_files')
      .select('version, upload_date')
      .eq('project_id', projectId)
      .order('upload_date', { ascending: false })
      .limit(1);
    
    let nextVersion = 'v1.0';
    const allVersions = [
      ...(versionData || []),
      ...(modifiedVersionData || [])
    ].sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
    
    if (allVersions.length > 0 && allVersions[0].version) {
      const match = /v(\d+)\.(\d+)/.exec(allVersions[0].version);
      if (match) {
        const major = Number(match[1]);
        const minor = Number(match[2]) + 1;
        nextVersion = `v${major}.${minor}`;
      } else {
        nextVersion = 'v1.0';
      }
    }

    if (isModification === 'true' && originalFileId) {
      // Insert into modified_files table
      const { data: result, error: insertError } = await supabase
        .from('modified_files')
        .insert({
          original_file_id: originalFileId,
          project_id: projectId,
          file_name: uniqueFileName,
          storage_path: req.file.filename,
          upload_date: new Date().toISOString().split('T')[0],
          report_date: reportDate,
          responsible: responsible,
          progress: Number(progress),
          observations: observations || '',
          file_size: fileSizeMb,
          version: nextVersion,
          category: category,
          sgps_code: sgpsCode || '',
          study_center_name: studyCenterName || '',
          regional: regional || '',
          project_responsibles: projectResponsibles || '',
          modification_reason: modificationReason || ''
        })
        .select('id')
        .single();
      
      if (insertError) throw insertError;
      res.json({ id: result.id, isModified: true });
    } else {
      // Insert into files table
      const { data: result, error: insertError } = await supabase
        .from('files')
        .insert({
          project_id: projectId,
          file_name: uniqueFileName,
          storage_path: req.file.filename,
          upload_date: new Date().toISOString().split('T')[0],
          report_date: reportDate,
          responsible: responsible,
          progress: Number(progress),
          observations: observations || '',
          file_size: fileSizeMb,
          version: nextVersion,
          category: category,
          sgps_code: sgpsCode || '',
          study_center_name: studyCenterName || '',
          regional: regional || '',
          project_responsibles: projectResponsibles || ''
        })
        .select('id')
        .single();
      
      if (insertError) throw insertError;
      res.json({ id: result.id, isModified: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const { showModified } = req.query;
    const tableName = showModified === 'true' ? 'modified_files' : 'files';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('file_name, storage_path')
      .eq('id', req.params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No encontrado' });
      }
      throw error;
    }
    
    const fullPath = path.join(uploadsDir, data.storage_path);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'Archivo no existe' });
    res.download(fullPath, data.file_name);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
